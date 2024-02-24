import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component } from '@angular/core';
import { ethers,Provider } from 'ethers';
import MetaMaskSDK from '@metamask/sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { API_URL, UP_TESTNET_ADDRESS, META_MASK_WALLET_ADDRESS, JK_UP_TESTNET_ADDRESS, UP_ABI } from '../constants';
import { RouterOutlet } from '@angular/router';


// import UniversalProfileContract from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
// import KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
// import { EIP191Signer } from '@lukso/eip191-signer.js';
// import { LSP25_VERSION } from '@lukso/lsp-smart-contracts/constants';

import UniversalProfileContract from '@lukso/lsp-smart-contracts';
import KeyManagerContract from '@lukso/lsp-smart-contracts';
import { EIP191Signer } from '@lukso/eip191-signer.js';
import { LSP25_VERSION } from '@lukso/lsp-smart-contracts';

// Define a custom type for the window object with the 'ethereum' property
interface CustomWindow extends Window {
  ethereum?: any; 
  lukso?: any;// Define 'ethereum' property as optional
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})

export class HomePageComponent {
  title = 'wlyx-v1';
  userForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    // this.test1();
    
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]]
    });
  }

  // connect to lukso wallet using LUKSO provider
  async connectLuksoWallet() {
    const luksoProvider = new ethers.BrowserProvider((window as CustomWindow).lukso);
    const signer = luksoProvider.getSigner();
    console.log('Signer:', signer);
    const address = await (await signer).getAddress();
    console.log('Connected address:', address);
  }

  async openMetaMaskWallet() {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Use the provider to interact with MetaMask wallet
      const signer = provider.getSigner();
      console.log('Signer:', signer);
      const address = await (await signer).getAddress();
      console.log('Connected address:', address);
    } else {
      console.log('MetaMask is not installed');
    }
  }

  // function to sign a message in metamask wallet
  async signMessage() {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const address = await (await signer).getAddress();
      console.log('Connected address:', address);
      const message = 'Hello metamask';
      const signature = await (await signer).signMessage(message);
      console.log('Signature:', signature);
    } else {
      console.log('MetaMask is not installed');
    }
  }

  // function to sign a message in lukso wallet
  async signMessageLukso() {
    const luksoProvider = new ethers.BrowserProvider((window as CustomWindow).lukso);
    const signer = luksoProvider.getSigner();
    console.log('Signer:', signer);
    const address = await (await signer).getAddress();
    console.log('Connected address:', address);
    const message = 'Hello Lukso';
    const signature = await (await signer).signMessage(message);
    console.log('Signature:', signature);
  }

  async saveUser() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      console.log('User data:', userData.name);
      // You can send the userData to your backend server or perform any other action here
      const provider = new ethers.BrowserProvider((window as CustomWindow).lukso);

      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      // Send transaction
      const tx = await signer.sendTransaction({
        from: account,                        // The Universal Profile address
        to: userData.name,                          // Receiving address, can be a UP or EOA
        value: ethers.parseEther('0.01') // 0.5 amount in ETH, in wei unit
      });
    } else {
      // Mark form controls as touched to show validation errors
      this.userForm.markAllAsTouched();
    }
  }

  // async executeRelayTransaction() {

  //   const provider = new ethers.JsonRpcProvider(
  //     'https://rpc.testnet.lukso.network',
  //   );
  //   const universalProfileAddress = UP_TESTNET_ADDRESS;
  //   const msgValue = 1; // Amount of native tokens to be sent
  //   const recipientAddress = JK_UP_TESTNET_ADDRESS;
    
  //   // setup the Universal Profile controller account
  //   const controllerPrivateKey = '0x...';
  //   const controllerAccount = new ethers.Wallet(controllerPrivateKey).connect(
  //     provider,
  //   );
    
  //   const universalProfile = new ethers.Contract(
  //     universalProfileAddress,
  //     UP_ABI,
  //     controllerAccount,
  //   );
    
  //   // const keyManagerAddress = await universalProfile.owner();
  //   const keyManagerAddress = await universalProfile['owner']();
  //   const keyManager = new ethers.Contract(
  //     keyManagerAddress,
  //     KeyManagerContract.abi,
  //     controllerAccount,
  //   );
    
  //   const channelId = 0;
  //   // const nonce = await keyManager.getNonce(controllerAccount.address, channelId);
  //   const nonce = await keyManager['getNonce'](controllerAccount.address, channelId);
    
  //   const validityTimestamps = 0; // no validity timestamp set
    
  //   const abiPayload = universalProfile.interface.encodeFunctionData('execute', [
  //     0, // Operation type: CALL
  //     recipientAddress,
  //     msgValue,
  //     '0x', // Data
  //   ]);
    
  //   const { chainId } = await provider.getNetwork();


  // }


}
