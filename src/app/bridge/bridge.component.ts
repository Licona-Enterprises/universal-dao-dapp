import { Component } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ethers,Provider } from 'ethers';
import MetaMaskSDK from '@metamask/sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import * as constants from '../constants';
import { RouterOutlet } from '@angular/router';


interface CustomWindow extends Window {
  ethereum?: any; 
  lukso?: any;// Define 'ethereum' property as optional
}

@Component({
  selector: 'app-bridge',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './bridge.component.html',
  styleUrl: './bridge.component.css'
})
export class BridgeComponent {
  bridgeForm: FormGroup = new FormGroup({});
  sendHomeForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.bridgeForm = this.formBuilder.group({
      token: ['', Validators.required],
      amount: ['', Validators.required],
      destinationAddress: ['', Validators.required]
    });
    this.sendHomeForm = this.formBuilder.group({
      token: ['', Validators.required],
      amount: ['', Validators.required],
      destinationAddress: ['', Validators.required]
    });
  }

  async bridgeTokens() {
    // const token = this.bridgeForm.value.token;
    
    // TODO make token dynamic
    const token = 'AAVE';
    const tokenName = 'AAVE';
    const tokenSymbol = 'AAVE';

    const amount = this.bridgeForm.value.amount;
    const destinationAddress = this.bridgeForm.value.destinationAddress;
    const bridgeAddress = constants.ETHEREUM_BRIDGE_ADDRESS;
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      // send tokens to bridge contract
      const tokenContractAddress = constants.AAVE_ETHEREUM_ADDRESS;
      const tokenContractABI = constants.AAVE_ETHEREUM_ABI;
      const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractABI, signer);
      const transferTx = await tokenContract['transfer'](bridgeAddress, amount);
      await transferTx.wait();

      // call deposit function in bridge contract
      const bridgeContractAddress = constants.ETHEREUM_BRIDGE_ADDRESS;
      const bridgeContractABI = constants.ETHEREUM_BRIDGE_ABI;
      const bridgeContract = new ethers.Contract(bridgeContractAddress, bridgeContractABI, signer);
      const depositTx = await bridgeContract['deposit'](tokenContractAddress, amount);
      await depositTx.wait();

      // create a new signer for based of another meta mask account
      const providerLukso = new ethers.JsonRpcProvider(constants.LUKSO_RPC_URL);
      const signerLukso = new ethers.Wallet(constants.DEV_PRIVATE_KEY, providerLukso);

      const tokenFactoryAddress = constants.LUKSO_TOKEN_FACTORY_ADDRESS;
      const tokenFactoryABI = constants.LUKSO_TOKEN_FACTORY_ABI;
      const tokenFactoryContract = new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signerLukso);
      const mintOrDeployTx = await tokenFactoryContract['mintOrDeployToken'](tokenSymbol,tokenName, amount, destinationAddress, tokenContractAddress);
      await mintOrDeployTx.wait();

      console.log('Bridging tokens:', token, amount, destinationAddress);

    } else {
      this.bridgeForm.markAllAsTouched();
    }
  }

  async sendHome() {
    const token = 'AAVE';
    const tokenName = 'AAVE';
    const tokenSymbol = 'AAVE';

    const amount = this.bridgeForm.value.amount;
    const destinationAddress = this.bridgeForm.value.destinationAddress;
    const bridgeAddress = constants.ETHEREUM_BRIDGE_ADDRESS;
    if (this.sendHomeForm.valid) {
      const provider = new ethers.BrowserProvider((window as CustomWindow).lukso);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
    }

  }

  async bridgeTokensV2() {
    const token = this.bridgeForm.value.token;
    const tokens = [
      { name: 'AAVE', symbol: 'AAVE', address: constants.AAVE_ETHEREUM_ADDRESS, abi: constants.AAVE_ETHEREUM_ABI, decimals: 18 },
      { name: 'DAI', symbol: 'DAI', address: constants.DAI_ETHEREUM_ADDRESS, abi: constants.DAI_ETHEREUM_ABI, decimals: 18 },
      { name: 'USDT', symbol: 'USDT', address: constants.USDT_ETHEREUM_ADDRESS, abi: constants.USDT_ETHEREUM_ABI, decimals: 6 },
      { name: 'USDC', symbol: 'USDC', address: constants.USDC_ETHEREUM_ADDRESS, abi: constants.USDC_ETHEREUM_ABI, decimals: 6 }
    ];

    const selectedToken = tokens.find(token => token.symbol === this.bridgeForm.value.token);

    if (selectedToken) {
      const { name, symbol, address, abi, decimals } = selectedToken;
      console.log('selectedToken ', name, symbol, address, decimals);
      // Use the address and ABI for further processing
    } else {
      // Handle the case when the selected token is not found
      console.log('Token not found');
    }

    const rawAmount = this.bridgeForm.value.amount;
    const destinationAddress = this.bridgeForm.value.destinationAddress;
    const bridgeAddress = constants.ETHEREUM_BRIDGE_ADDRESS;
    const decimals = selectedToken?.decimals; // Declare the 'decimals' variable
    let stringNumber = rawAmount.toString();
    const valueInWei = ethers.parseUnits(stringNumber, decimals);
    const valueInEther = ethers.formatUnits(valueInWei, decimals);
    // console.log('valueInWei:', valueInWei);
    console.log('user value:', valueInEther);

    const amount = valueInWei.toString();
    console.log('amount:', amount);

    const amountForLuskoBigNum = ethers.parseUnits(stringNumber, 18);
    const ether = ethers.formatUnits(amountForLuskoBigNum, 18);
    console.log('wei:', amountForLuskoBigNum);
    console.log('ether:', ether);

    const amountToMint = amountForLuskoBigNum.toString();


    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      // send tokens to bridge contract
      const tokenContractAddress = selectedToken?.address ?? '';
      const tokenContractABI = selectedToken?.abi ?? '';
      const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractABI, signer);
      const transferTx = await tokenContract['transfer'](bridgeAddress, amount);
      await transferTx.wait();

      // call deposit function in bridge contract
      const bridgeContractAddress = constants.ETHEREUM_BRIDGE_ADDRESS;
      const bridgeContractABI = constants.ETHEREUM_BRIDGE_ABI;
      const bridgeContract = new ethers.Contract(bridgeContractAddress, bridgeContractABI, signer);
      const depositTx = await bridgeContract['deposit'](tokenContractAddress, amount);
      await depositTx.wait();

      // create a new signer for based of another meta mask account
      const providerLukso = new ethers.JsonRpcProvider(constants.LUKSO_RPC_URL);
      const signerLukso = new ethers.Wallet(constants.DEV_PRIVATE_KEY, providerLukso);
      const tokenFactoryAddress = constants.LUKSO_TOKEN_FACTORY_ADDRESS;
      const tokenFactoryABI = constants.LUKSO_TOKEN_FACTORY_ABI;
      const tokenFactoryContract = new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signerLukso);
      const mintOrDeployTx = await tokenFactoryContract['mintOrDeployToken'](selectedToken?.symbol,selectedToken?.name, amountToMint, destinationAddress, tokenContractAddress);
      await mintOrDeployTx.wait();

      console.log('Bridging tokens:', token, amount, destinationAddress);

    } else {
      this.bridgeForm.markAllAsTouched();
    }
  }

}
