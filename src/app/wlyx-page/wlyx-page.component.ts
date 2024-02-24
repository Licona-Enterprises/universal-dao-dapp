import { Component } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ethers,Provider } from 'ethers';
import MetaMaskSDK from '@metamask/sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { API_URL, UP_TESTNET_ADDRESS, META_MASK_WALLET_ADDRESS, JK_UP_TESTNET_ADDRESS, UP_ABI, WLYX_TESTNET_ADDRESS, WLYX_TESTNET_ABI, UP_TESTNET_PRIVATE_KEY } from '../constants';
import { RouterOutlet } from '@angular/router';
import * as constants from '../constants';

// Define a custom type for the window object with the 'ethereum' property
interface CustomWindow extends Window {
  ethereum?: any; 
  lukso?: any;// Define 'ethereum' property as optional
}

@Component({
  selector: 'app-wlyx-page',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './wlyx-page.component.html',
  styleUrl: './wlyx-page.component.css'
})
export class WlyxPageComponent {

  form: FormGroup;
  unwrapForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      amount: ['', Validators.required]
    });
    this.unwrapForm = this.formBuilder.group({
      amount: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const amount = this.form.value.amount;
      // Do something with the amount, such as saving it to a variable or sending it to an API
      console.log(amount);
    }

  }

  async wrapLyx() {
    if (this.form.valid) {
      const amount = this.form.value.amount;
      const amount2 = ethers.parseUnits(amount, 18);
      const amountToMint = amount2.toString();
      console.log('User data:', amountToMint);

      // You can send the userData to your backend server or perform any other action here
      const provider = new ethers.BrowserProvider((window as CustomWindow).lukso);

      const signer = await provider.getSigner();
      const destinationAddress = await signer.getAddress();

      // create a new signer for based of another meta mask account
      const providerLukso = new ethers.JsonRpcProvider(constants.LUKSO_RPC_URL);
      const signerLukso = new ethers.Wallet(constants.DEV_PRIVATE_KEY, providerLukso);
      const tokenFactoryAddress = constants.LUKSO_TOKEN_FACTORY_ADDRESS;
      const tokenFactoryABI = constants.LUKSO_TOKEN_FACTORY_ABI;
      const tokenFactoryContract = new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signerLukso);
      // TODO add erc20 contract address
      const mintOrDeployTx = await tokenFactoryContract['mintOrDeployToken']('Universal Token','UNIT', amountToMint, destinationAddress, '0xE5Cc8f6296004845Bd55465FF50fF24560A14921');
      await mintOrDeployTx.wait();

      console.log('minting tokens:', 'UNIT', amount, destinationAddress);

    }

  }


  async unWrapLyx() {

    if (this.unwrapForm.valid) {
      const amount = this.unwrapForm.value.amount;
      const bigIntValue = ethers.parseEther(amount);
      const otherNum = bigIntValue.toString();
      console.log('otherNum:', otherNum);


      const userData = this.unwrapForm.value;
      const provider = new ethers.BrowserProvider((window as CustomWindow).lukso);

      // Create a signer using the provider
      const signer = await provider.getSigner();

      // Create an instance of the contract using the contract address and ABI
      const contract = new ethers.Contract(WLYX_TESTNET_ADDRESS, WLYX_TESTNET_ABI, signer);

      // Call the contract function
      // const result = await contract.$FUNCTION_NAME$($PARAMETERS$);
      // const result = await contract['withdraw']('10000000000000000');
      const result = await contract['balanceOf']('0x3eA93c4F70128BEb673b12E23256516535B754Ea');
      

      // Handle the result
      console.log('Contract function result:', result);
    }
  }

  async unWrapLyx2() {

    if (this.unwrapForm.valid) {
      const amount = this.unwrapForm.value.amount;
      const bigIntValue = ethers.parseEther(amount);
      const otherNum = bigIntValue.toString();
      console.log('otherNum:', otherNum);

      const userData = this.unwrapForm.value;


      const privateKey = UP_TESTNET_PRIVATE_KEY;
      // Create a signer from the private key
      // const provider = new ethers.BrowserProvider((window as CustomWindow).lukso);

      const providerObject = (window as CustomWindow).lukso || window.ethereum;
      const provider = new ethers.BrowserProvider(providerObject);

      const signer = new ethers.Wallet(privateKey, provider);
      const address = await (await signer).getAddress();

      // const signer2 = await provider.getSigner();
      // const account = await signer2.getAddress();

      // Create an instance of the contract interface
      const contract = new ethers.Contract(WLYX_TESTNET_ADDRESS, WLYX_TESTNET_ABI, provider);

      // Attach the signer to the contract interface
      const connectedContract = contract.connect(signer);

      // Call a contract function (example)
      try {
        // const result = await connectedContract.someFunction();
        const balanceOf = await contract['balanceOf'](address);
        // const result = await connectedContract['withdraw'](otherNum);
        console.log('address:', address);
        console.log('balanceOf result:', balanceOf);
        console.log('input result:', otherNum);
        const result = await contract['withdraw'](otherNum);
      } catch (error) {
        console.error('Error calling function:', error);
      }
      
    }
  }

  async unWrapLyx3() {
    if (this.unwrapForm.valid) {
      const amount = this.unwrapForm.value.amount;
      const userData = this.unwrapForm.value;
      console.log('User data:', amount);
      // You can send the userData to your backend server or perform any other action here
      const provider = new ethers.BrowserProvider((window as CustomWindow).lukso);

      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      // Send transaction
      const tx = await signer.sendTransaction({
        from: WLYX_TESTNET_ADDRESS,                        // The Universal Profile address
        to: account,                          // Receiving address, can be a UP or EOA
        value: ethers.parseEther(amount) // 0.5 amount in ETH, in wei unit
      });

      const contract = new ethers.Contract(WLYX_TESTNET_ADDRESS, WLYX_TESTNET_ABI, provider);

    }

  }


  async checkEvent() {
    // const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const provider = new ethers.BrowserProvider((window as CustomWindow).lukso);
    const contract = new ethers.Contract(WLYX_TESTNET_ADDRESS, WLYX_TESTNET_ABI, provider);

    // Replace 'EventName' with the actual name of the event you want to listen to
    contract.on('EventName', (eventData) => {
      // Handle the event data here
      console.log('Event emitted:', eventData);
    });
  }



}
