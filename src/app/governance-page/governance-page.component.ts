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
  selector: 'app-governance-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './governance-page.component.html',
  styleUrl: './governance-page.component.css'
})
export class GovernancePageComponent {
  depositForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.depositForm = this.formBuilder.group({
      amount: ['', Validators.required]
    });
  }

  async depositLyx() {
    if (this.depositForm.valid) {
      const amount = this.depositForm.value.amount;
      const provider = new ethers.BrowserProvider((window as CustomWindow).lukso);
      const signer = await provider.getSigner();
      const destinationAddress = await signer.getAddress();
      const account = await signer.getAddress();
      const tx = await signer.sendTransaction({
        from: account,                        // The Universal Profile address
        // to: '0xF752aC5C3Dfcc55F68D7DafA8300EFdCf4E3cbc7',                          // Receiving address, can be a UP or EOA
        to: constants.UNIVERSAL_TOKEN_VAULT_ADDRESS,
        value: ethers.parseEther(amount) // 0.5 amount in ETH, in wei unit
      });


      const multiplier = BigInt(4);
      // const amount = this.depositForm.value.amount;
      const amount2 = ethers.parseUnits(amount, 18);
      const amount3 = amount2 * multiplier;
      const amountToMint = amount3.toString();

      // You can send the userData to your backend server or perform any other action here
      // const provider = new ethers.BrowserProvider((window as CustomWindow).lukso);
      // const signer = await provider.getSigner();
      // const destinationAddress = await signer.getAddress();

      // create a new signer for based of another meta mask account
      const providerLukso = new ethers.JsonRpcProvider(constants.LUKSO_RPC_URL);
      const signerLukso = new ethers.Wallet(constants.DEV_PRIVATE_KEY, providerLukso);
      const tokenFactoryAddress = constants.LUKSO_TOKEN_FACTORY_ADDRESS;
      const tokenFactoryABI = constants.LUKSO_TOKEN_FACTORY_ABI;
      const tokenFactoryContract = new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signerLukso);
      const mintOrDeployTx = await tokenFactoryContract['mintOrDeployToken']('Universal Token','UNIT', amountToMint, destinationAddress, constants.UNIVERSAL_TOKEN_ERC20_ETHEREUM_ADDRESS);
      await mintOrDeployTx.wait();

      console.log('minting tokens:', 'UNIT', amountToMint, destinationAddress);

    }
  }


}
  


