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
    }
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
          const multisendGas = await this.txStore.getMultisendGas({slice: this.tokenStore.totalNumberTx, addPerTx: this.tokenStore.arrayLimit})
          this.setState({multisendGas})
        } else {
          if (new BN(this.tokenStore.allowance).gte(new BN(this.tokenStore.totalBalance))){
            const multisendGas = await this.txStore.getMultisendGas({slice: this.tokenStore.totalNumberTx, addPerTx: this.tokenStore.arrayLimit})
            this.setState({multisendGas})
          } else {
            const approveGas = await this.txStore.getApproveGas()
            this.setState({approveGas})
          }
        }
      } catch(ex) {
        console.log("3:", ex)
      }
    })()
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
    if( new BN(this.tokenStore.totalCostInEth).gt(new BN(this.tokenStore.ethBalance))){
      console.error('please fund you account in ')
      swal({
        title: "Insufficient ETH balance",
        text: `You don't have enough ETH to send to all addresses. Amount needed: ${this.tokenStore.totalCostInEth} ETH`,
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
    const gasPrice = this.gasPriceStore.standardInHex
    const transferEthValue = new BN(gasPrice).times(new BN(this.state.transferGas))
    const displayTransferEthValue = Web3Utils.fromWei(transferEthValue.toString())
    // const approveGasEthValue = new BN(gasPrice).times(new BN(this.state.approveGas))
    // const displayApproveGasEthValue = Web3Utils.fromWei(approveGasEthValue.toString())
    const approvePlusMultisendGas = (new BN(this.state.multisendGas)).plus(new BN(this.state.approveGas))
    const multisendGasEthValue = new BN(gasPrice).times(approvePlusMultisendGas)
    const displayMultisendGasEthValue = Web3Utils.fromWei(multisendGasEthValue.toString())
    const savedGas = approvePlusMultisendGas.minus(new BN(this.state.transferGas))
    const savedGasEthValue = new BN(gasPrice).times(savedGas)
    const displaySavedGasEthValue = parseFloat(Web3Utils.fromWei(savedGasEthValue.toString())).toFixed(5)
    let sign = ""
    if (approvePlusMultisendGas.gt(new BN(this.state.transferGas))) {
      sign = "-"
    }
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
            Verify addresses and values and choose Gas Price please
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
            <div className="send-info">
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
