import { Component } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ethers,Provider } from 'ethers';
import MetaMaskSDK from '@metamask/sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import * as constants from '../constants';
import { RouterOutlet } from '@angular/router';

import UniversalProfileContract from '@lukso/lsp-smart-contracts';
import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

interface CustomWindow extends Window {
  ethereum?: any; 
  lukso?: any;// Define 'ethereum' property as optional
}

@Component({
  selector: 'app-stablecoin-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './stablecoin-page.component.html',
  styleUrl: './stablecoin-page.component.css'
})
export class StablecoinPageComponent {
  depositForm: FormGroup;
  depositValue: number | undefined;

  constructor(private formBuilder: FormBuilder) {
    this.depositForm = this.formBuilder.group({
      amount: ['', Validators.required]
    });
  }

  async checkLyxMarketPrice() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=lukso-token&vs_currencies=usd');
    const data = await response.json();
    const lyxPrice = data['lukso-token'].usd;
    this.depositValue = this.depositForm.value.amount * lyxPrice + (lyxPrice*.01);
  }


  async depositLyx() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=lukso-token&vs_currencies=usd');
    const data = await response.json();
    const lyxPrice = data['lukso-token'].usd;
    this.depositValue = this.depositForm.value.amount * lyxPrice + (lyxPrice*.01);

    // check Ethereum vault stablecoin balance
    const ethProvider = new ethers.JsonRpcProvider(constants.ALECHEMY_RPC_URL);
    const walletAddress = constants.STABLECOIN_VAULT_ETHEREUM;
    const daiContract = new ethers.Contract(constants.DAI_ETHEREUM_ADDRESS, constants.DAI_ETHEREUM_ABI, ethProvider);
    const usdtContract = new ethers.Contract(constants.USDT_ETHEREUM_ADDRESS, constants.USDT_ETHEREUM_ABI, ethProvider);
    const usdcContract = new ethers.Contract(constants.USDC_ETHEREUM_ADDRESS, constants.USDC_ETHEREUM_ABI, ethProvider);
    const daiBalance = await daiContract['balanceOf'](walletAddress);
    const usdtBalance = await usdtContract['balanceOf'](walletAddress);
    const usdcBalance = await usdcContract['balanceOf'](walletAddress);
    // TODO add and format all balances
    const totalStablecoinBalance = ethers.parseUnits("30000", 18);
    const luksoProvider = new ethers.JsonRpcProvider(constants.LUKSO_RPC_URL);


    if (this.depositForm.value.amount >=0) {
      // send LYX to Universal Token Vault
      const amount = this.depositForm.value.amount * lyxPrice;
      const provider = new ethers.BrowserProvider((window as CustomWindow).lukso);
      const signer = await provider.getSigner();
      const destinationAddress = await signer.getAddress();
      const account = await signer.getAddress();
      const tx = await signer.sendTransaction({
        from: account,
        // to: '0xF752aC5C3Dfcc55F68D7DafA8300EFdCf4E3cbc7',
        to: constants.UNIVERSAL_TOKEN_VAULT_ADDRESS,
        value: ethers.parseEther(amount.toString())
      });

      // add 1% to the amount and mint USD
      const multiplier = Number(.01);
      const amount2 = ethers.parseUnits(String(amount), 18);
      const amount3 = Number(amount2) * multiplier;
      console.log('amount3:', amount3); 
      const amount4 = Number(amount2) + amount3;
      const amountToMint = amount4.toString();

      // TODO if total amount is less than vault amount then mint USD

      // create a new signer for based of another meta mask account
      const providerLukso = new ethers.JsonRpcProvider(constants.LUKSO_RPC_URL);
      const signerLukso = new ethers.Wallet(constants.DEV_PRIVATE_KEY, providerLukso);
      const tokenFactoryAddress = constants.LUKSO_TOKEN_FACTORY_ADDRESS;
      const tokenFactoryABI = constants.LUKSO_TOKEN_FACTORY_ABI;
      const tokenFactoryContract = new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signerLukso);
      const mintOrDeployTx = await tokenFactoryContract['mintOrDeployToken']('Universal Dollar','USD', amountToMint, destinationAddress, constants.STABLECOIN_VAULT_ETHEREUM);
      await mintOrDeployTx.wait();
      console.log('minting tokens:', 'USD', amountToMint, destinationAddress);

    }
  }

  isValueGreaterThanZero(): boolean {
    return (this.depositValue ?? 0) > 0;
  }

}
