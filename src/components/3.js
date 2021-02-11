import React from 'react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view'
import { inject, observer } from "mobx-react";
import BN from 'bignumber.js'
import Web3Utils from 'web3-utils'
import swal from 'sweetalert';
import Select from 'react-select';

@inject("UiStore")
@observer
export class ThirdStep extends React.Component {
  constructor(props){
    super(props);
    this.tokenStore = props.UiStore.tokenStore;
    this.txStore = props.UiStore.txStore;
    this.gasPriceStore = props.UiStore.gasPriceStore;
    console.log(this.gasPriceStore.gasPricesArray)
    this.onNext = this.onNext.bind(this)
    this.state = {
      gasPrice: '',
      transferGas: 0,
      approveGas: 0,
      multisendGas: 0,
      selectedGasShare: '50'
    }
    this.gasSharesArray = [
      {label: '20%', value: '20'},
      {label: '50%', value: '50'},
      {label: '70%', value: '70'},
      {label: '100%', value: '100'},
    ]
  }
  componentDidMount() {
    if(this.tokenStore.dublicates.length > 0){

      swal({
        title: `There were duplicated eth addresses in your list.`,
        text: `${JSON.stringify(this.tokenStore.dublicates.slice(), null, '\n')}.\n Multisender already combined the balances for those addreses. Please make sure it did the calculation correctly.`,
        icon: "warning",
      })
    }
    (async () => {
      try {
        const transferGas = await this.txStore.getTransferGas({slice: this.tokenStore.totalNumberTx, addPerTx: this.tokenStore.arrayLimit})
        this.setState({transferGas})
        if ("0x000000000000000000000000000000000000bEEF" === this.tokenStore.tokenAddress) {
          // Ether
          const multisendGasOrig = await this.txStore.getMultisendGas({slice: this.tokenStore.totalNumberTx, addPerTx: this.tokenStore.arrayLimit})
          // Gas Limit: 84,279
          // Gas Used by Transaction: 82,164 (97.49%)
          const multisendGas = Math.floor(parseInt(multisendGasOrig) * 0.975)
          this.setState({multisendGas})
          this.updateCurrentFee()
        } else {
          if (parseFloat(this.tokenStore.allowance) >= (parseFloat(this.tokenStore.totalBalance))){
            const multisendGasOrig = await this.txStore.getMultisendGas({slice: this.tokenStore.totalNumberTx, addPerTx: this.tokenStore.arrayLimit})
            // Gas Limit: 116,153
            // Gas Used by Transaction: 81,933 (70.54%) for ERC20
            // Gas Limit: 170,018
            // Gas Used by Transaction: 135,628 (79.77%) for ERC777 // TODO: detect token type
            const multisendGas = Math.floor(parseInt(multisendGasOrig) * 0.71)
            const approveGas = await this.txStore.getApproveTxGas()
            this.setState({multisendGas, approveGas})
            this.updateCurrentFee()
          } else {
            const approveGasOrig = await this.txStore.getApproveGas()
            // Gas Limit: 66,181
            // Gas Used by Transaction: 44,121 (66.67%)
            const approveGas = Math.floor(parseInt(approveGasOrig) * 0.6667)
            this.setState({approveGas})
          }
        }
      } catch(ex) {
        console.log("3:", ex)
      }
    })()
  }

  updateCurrentFee() {
    const id = setTimeout(() => {
      clearTimeout(id)
      this._updateCurrentFeeImpl()
    }, 0)
  }

  _updateCurrentFeeImpl() {
    const { selectedGasShare, multisendGas, approveGas, transferGas } = this.state
    const gasPrice = this.gasPriceStore.standardInHex
    const approvePlusMultisendGas = (new BN(multisendGas)).plus(new BN(approveGas))
    if (approvePlusMultisendGas.gt(new BN(transferGas))) {
      // no savings
      this.tokenStore.setCurrentFee('0')
      return
    }
    const savedGas = (new BN(transferGas)).minus(approvePlusMultisendGas)
    const savedGasEthValue = new BN(gasPrice).times(savedGas)
    const savedGasPerTxEthValue = savedGasEthValue.div(this.tokenStore.totalNumberTx)
    const newCurrentFee = savedGasPerTxEthValue.times(new BN(parseInt(selectedGasShare))).div(100)
    const newCurrentFeeRounded = newCurrentFee.dp(0, 1)
    this.tokenStore.setCurrentFee(newCurrentFeeRounded.toString(10))
  }

  onNext(e) {
    e.preventDefault();
    if (new BN(this.tokenStore.totalBalance).gt(new BN(this.tokenStore.defAccTokenBalance))){
      console.error('Your balance is less than total to send')
      swal({
        title: "Insufficient token balance",
        text: `You don't have enough tokens to send to all addresses.\nAmount needed: ${this.tokenStore.totalBalance} ${this.tokenStore.tokenSymbol}`,
        icon: "error",
      })
      return
    }
    const multisendGasEthValue = this.getMultisendPlusApproveGasEthValue()
    const ethBalanceWei = Web3Utils.toWei(this.tokenStore.ethBalance, 'ether');
    if( multisendGasEthValue.gt(new BN(ethBalanceWei))){
      const displayMultisendGasEthValue = parseFloat(Web3Utils.fromWei(multisendGasEthValue.toString())).toFixed(5)
      console.error('please fund you account in ')
      swal({
        title: "Insufficient ETH balance",
        text: `You don't have enough ETH to send to all addresses. Amount needed: ${displayMultisendGasEthValue} ETH`,
        icon: "error",
      })
      return
    }
    if ("0x000000000000000000000000000000000000bEEF" === this.tokenStore.tokenAddress) {
      // Ether
      this.props.history.push('/4')
    } else {
      if (new BN(this.tokenStore.allowance).gte(new BN(this.tokenStore.totalBalance))){
        this.props.history.push('/4')
      } else {
        this.props.history.push('/approve')
      }
    }
  }

  onGasPriceChange = (selected) => {
    if(selected){
      this.gasPriceStore.setSelectedGasPrice(selected.value)
      this.updateCurrentFee()
    }
  }

  onGasShareChange = (selected) => {
    if(selected){
      this.setState({
        selectedGasShare: selected.value,
      })
      this.updateCurrentFee()
    }
  }

  renderTokenBalance() {
    if ("0x000000000000000000000000000000000000bEEF" === this.tokenStore.tokenAddress) {
      return null
    }
    const value = parseFloat(this.tokenStore.defAccTokenBalance)
    let displayValue = value.toFixed(5)
    if ("0.00000" === displayValue) {
      displayValue = value
    }
    return (
      <div className="send-info-i">
        <p>Your Balance</p>
        <p className="send-info-amount">{displayValue} {this.tokenStore.tokenSymbol}</p>
      </div>
    )
  }

  renderTokenAllowance() {
    if ("0x000000000000000000000000000000000000bEEF" === this.tokenStore.tokenAddress) {
      return null
    }
    return (
      <div className="send-info-i">
        <p>Current Allowance</p>
        <p className="send-info-amount">{this.tokenStore.allowance} {this.tokenStore.tokenSymbol}</p>
      </div>
    )
  }

  renderTransferGasInfo() {
    const gasPrice = this.gasPriceStore.standardInHex
    const transferEthValue = new BN(gasPrice).times(new BN(this.state.transferGas))
    const displayTransferEthValue = parseFloat(Web3Utils.fromWei(transferEthValue.toString())).toFixed(5)
    if ("0x000000000000000000000000000000000000bEEF" === this.tokenStore.tokenAddress) {
      // Ether
      return (
        <div className="send-info-i">
          <p>Gas spent without Multisend</p>
          <p className="send-info-amount">{displayTransferEthValue} ETH ({this.state.transferGas} GAS)</p>
        </div>
      )
    } else {
      if (new BN(this.tokenStore.allowance).gte(new BN(this.tokenStore.totalBalance))){
        return (
          <div className="send-info-i">
            <p>Gas spent without Multisend</p>
            <p className="send-info-amount">{displayTransferEthValue} ETH ({this.state.transferGas} GAS)</p>
          </div>
        )
      } else {
        return (
          <div className="send-info-i">
            <p>Gas spent without Multisend</p>
            <p className="send-info-amount">{displayTransferEthValue} ETH ({this.state.transferGas} GAS)</p>
          </div>
        )
      }
    }
  }

  getMultisendPlusApproveGasEthValue() {
    const gasPrice = this.gasPriceStore.standardInHex
    const approvePlusMultisendGas = (new BN(this.state.multisendGas)).plus(new BN(this.state.approveGas))
    const multisendGasEthValue = new BN(gasPrice).times(approvePlusMultisendGas)
    return multisendGasEthValue
  }

  renderMultisendGasInfo() {
    const gasPrice = this.gasPriceStore.standardInHex
    const approvePlusMultisendGas = (new BN(this.state.multisendGas)).plus(new BN(this.state.approveGas))
    const multisendGasEthValue = new BN(gasPrice).times(approvePlusMultisendGas)
    const displayMultisendGasEthValue = parseFloat(Web3Utils.fromWei(multisendGasEthValue.toString())).toFixed(5)
    if ("0x000000000000000000000000000000000000bEEF" === this.tokenStore.tokenAddress) {
      // Ether
      return (
        <div className="send-info-i">
          <p>Gas spent with Multisend</p>
          <p className="send-info-amount">{displayMultisendGasEthValue} ETH ({approvePlusMultisendGas.toString()} GAS)</p>
        </div>
      )
    } else {
      if (new BN(this.tokenStore.allowance).gte(new BN(this.tokenStore.totalBalance))){
        return (
          <div className="send-info-i">
            <p>Gas spent with Multisend</p>
            <p className="send-info-amount">{displayMultisendGasEthValue} ETH ({approvePlusMultisendGas.toString()} GAS)</p>
          </div>
        )
      } else {
      }
    }
  }

  renderSavingsGasInfo() {
    const { selectedGasShare, multisendGas, approveGas, transferGas } = this.state
    const gasPrice = this.gasPriceStore.standardInHex
    const transferEthValue = new BN(gasPrice).times(new BN(this.state.transferGas))
    const displayTransferEthValue = Web3Utils.fromWei(transferEthValue.toString())
    // const approveGasEthValue = new BN(gasPrice).times(new BN(this.state.approveGas))
    // const displayApproveGasEthValue = Web3Utils.fromWei(approveGasEthValue.toString())
    const approvePlusMultisendGas = (new BN(multisendGas)).plus(new BN(approveGas))
    const multisendGasEthValue = new BN(gasPrice).times(approvePlusMultisendGas)
    const displayMultisendGasEthValue = Web3Utils.fromWei(multisendGasEthValue.toString())
    const savedGas = (new BN(transferGas)).minus(approvePlusMultisendGas)
    const savedGasEthValue = new BN(gasPrice).times(savedGas)
    const displaySavedGasEthValue = parseFloat(Web3Utils.fromWei(savedGasEthValue.toString())).toFixed(5)
    let sign = ""
    // if (approvePlusMultisendGas.gt(new BN(transferGas))) {
    //   sign = "-"
    // }
    if ("0x000000000000000000000000000000000000bEEF" === this.tokenStore.tokenAddress) {
      // Ether
      return (
        <div className="send-info-i">
          <p>Your gas savings</p>
          <p className="send-info-amount">{sign}{displaySavedGasEthValue} ETH ({sign}{savedGas.toString()} GAS)</p>
        </div>
      )
    } else {
      if (new BN(this.tokenStore.allowance).gte(new BN(this.tokenStore.totalBalance))){
        return (
          <div className="send-info-i">
            <p>Your gas savings</p>
            <p className="send-info-amount">{sign}{displaySavedGasEthValue} ETH ({sign}{savedGas.toString()} GAS)</p>
          </div>
        )
      } else {
      }
    }
  }

  render() {
    return (
      <div className="container container_bg">
        <div className="content">
          <h1 className="title"><strong>Welcome to Token</strong> MultiSender</h1>
          <p className="description">
            Verify addresses and values and choose <strong>Gas Price</strong> and <strong>Gas Sharing</strong> values<br/>
            <strong>Gas Sharing</strong> is a portion of gas saved by this service that you are OK to tip
          </p>
          <form className="form">
            <ReactJson displayDataTypes={false}
              style={{backgroundColor: 'none'}}
              indentWidth="2"
              iconStyle="square"
              name={false}
              theme="solarized"
              src={this.tokenStore.jsonAddresses.slice()} />
            <div style={{padding: "25px 0px"}}>
              <p>Network Speed (Gas Price)</p>
              <Select.Creatable
                isLoading={this.gasPriceStore.loading}
                value={this.gasPriceStore.selectedGasPrice}
                onChange={this.onGasPriceChange}
                loadingPlaceholder="Fetching gas Price data ..."
                placeholder="Please select desired network speed"
                options={this.gasPriceStore.gasPricesArray.slice()}
              />
            </div>
            <div>
              <p>Saved Gas Sharing</p>
              <Select.Creatable
                isLoading={false}
                value={this.state.selectedGasShare}
                onChange={this.onGasShareChange}
                loadingPlaceholder=""
                placeholder="Please select desired gas sharing"
                options={this.gasSharesArray.slice()}
              />
            </div>
            <div className="send-info" style={{padding: "25px 0px"}}>
              <div className="send-info-side">
                <div className="send-info-i">
                  <p>{ "0x000000000000000000000000000000000000bEEF" === this.tokenStore.tokenAddress ? "Total ETH to be Sent" : "Total Tokens to be Sent" }</p>
                  <p className="send-info-amount">{this.tokenStore.totalBalance} {this.tokenStore.tokenSymbol}</p>
                </div>
                {
                  this.renderTokenBalance()
                }
                <div className="send-info-i">
                  <p>Your ETH Balance</p>
                  <p className="send-info-amount">{this.tokenStore.ethBalance}</p>
                </div>
                { this.renderTransferGasInfo() }
              </div>
              <div className="send-info-side">
                {
                  this.renderTokenAllowance()
                }
                <div className="send-info-i">
                  <p>Total Number of tx Needed</p>
                  <p className="send-info-amount">{this.tokenStore.totalNumberTx}</p>
                </div>
                { this.renderMultisendGasInfo() }
                { this.renderSavingsGasInfo() }
              </div>
            </div>

            <Link onClick={this.onNext} className="button button_next" to='/4'>Next</Link>
          </form>
        </div>
      </div>
    );
  }
}
