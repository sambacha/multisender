import React from 'react';
import { inject, observer } from "mobx-react";
import { Transaction } from "./Transaction"
import { Link } from 'react-router-dom';

@inject("UiStore")
@observer
export class FourthStep extends React.Component {
  constructor(props){
    super(props);
    this.txStore = props.UiStore.txStore;
    this.tokenStore = props.UiStore.tokenStore;
    this.explorerUrl = props.UiStore.web3Store.explorerUrl;
    this.onNext = this.onNext.bind(this)
    this.intervalId = null
    this.state = {
      txs: this.txStore.txs,
      totalNumberOftx: this.calcTotalNumberOftx(),
    }
    this.doSendExecuted = false
  }

  onNext(e) {
    e.preventDefault();
    // reload page to make sure that all caches are cleared
    location.reload()
    // this.props.history.push('/')
  }

  componentDidMount(){
    (async () => {
      try {
        if (!this.doSendExecuted) {
          this.doSendExecuted = true
          await this.txStore.doSend()
          this.setState({
            txs: this.txStore.txs,
            totalNumberOftx: this.calcTotalNumberOftx(),
          })
        }
      } catch(e){
        console.log('doApprove error:', e)
      }
    })()
    if (null === this.intervalId) {
      this.intervalId = setInterval(() => {
        this.setState({
          txs: this.txStore.txs,
          totalNumberOftx: this.calcTotalNumberOftx(),
        })
      }, 1000)
    }
  }

  componentWillUnmount() {
    if (null !== this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  renderHomeButton() {
      return (
        <Link onClick={this.onNext} className="button button_prev" to='/'>Home</Link>
      )
  }

  calcTotalNumberOftx() {
    let totalNumberOftx;

    // if(Number(this.tokenStore.totalBalance) > Number(this.tokenStore.allowance)){
    //   totalNumberOftx = Number(this.tokenStore.totalNumberTx) + 1;
    // } else {
      totalNumberOftx = Number(this.tokenStore.totalNumberTx)
    // }
    return totalNumberOftx
  }

  render () {
    const { txs, totalNumberOftx } = this.state
    const txHashes = txs.map((tx, index) => {
      return <Transaction key={index} tx={{...tx}} explorerUrl={this.explorerUrl}/>
    })
    const mined = txs.reduce((mined, tx) => {
      const { status } = tx
      return mined && status === "mined"
    }, true)
    let status;
    if(txs.length === totalNumberOftx){
      if (mined) {
        status =  "All transactions are mined. Congratulations!"
      } else {
        status =  "Transactions were sent out. Now wait until all transactions are mined."
      }
    } else {
      const txCount = totalNumberOftx - txs.length
      status = `Please wait...until you sign ${txCount} transactions in Metamask`
    }
    return (
      <div className="container container_bg">
        <div className="content">
          <h1 className="title"><strong>Welcome to Token</strong> MultiSender</h1>
          <p className="description">
            This Dapp supports Mainnet, Ropsten, Rinkeby, Kovan, Goerli
          </p>
          <form className="form">
            <p>{status}</p>
            <div className="table">
              {txHashes}
            </div>
            { this.renderHomeButton() }
          </form>
        </div>
      </div>
    );
  }
}
