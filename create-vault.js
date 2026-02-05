const xrpl = require('xrpl')
const { deriveKeypair, sign } = require('ripple-keypairs')
const { encodeForSigning } = require('ripple-binary-codec')

async function createVaultAndBrokers() {
  // Connect to devnet
  // const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233/');
  const client = new xrpl.Client('wss://lend.devnet.rippletest.net:51233/')
  await client.connect()

  console.log('Connected to XRPL devnet\n')

  // Create and fund wallets via faucet
  // const faucetHost = 'faucet.devnet.rippletest.net';
  const faucetHost = 'lend-faucet.devnet.rippletest.net'
  const faucetPath = '/accounts'

  console.log('Funding wallets via faucet...')
  const [
    { wallet: vaultOwnerWallet },
    { wallet: borrowerWallet },
    { wallet: depositorWallet },
  ] = await Promise.all([
    client.fundWallet(null, { faucetHost, faucetPath }),
    client.fundWallet(null, { faucetHost, faucetPath }),
    client.fundWallet(null, { faucetHost, faucetPath }),
  ])
  console.log('Wallets funded successfully!\n')

  console.log('Vault Owner address:', vaultOwnerWallet.address)
  console.log('Borrower address:', borrowerWallet.address)
  console.log('Depositor address:', depositorWallet.address)
  let createImpairedLoan
  let createDefaultedLoan

  // ========================================
  // Step 1: Create Vault
  // ========================================
  console.log('\n📦 Creating Vault...')
  const vaultCreateTx = {
    TransactionType: 'VaultCreate',
    Account: vaultOwnerWallet.address,
    Asset: { currency: 'XRP' },
  }

  const vaultResult = await client.submitAndWait(vaultCreateTx, {
    wallet: vaultOwnerWallet,
  })

  if (vaultResult.result.meta.TransactionResult !== 'tesSUCCESS') {
    throw new Error(
      `Vault creation failed: ${vaultResult.result.meta.TransactionResult}`,
    )
  }

  // Extract Vault ID from metadata
  const vaultCreatedNode = vaultResult.result.meta.AffectedNodes.find(
    (node) => node.CreatedNode && node.CreatedNode.LedgerEntryType === 'Vault',
  )
  const vaultId = vaultCreatedNode.CreatedNode.LedgerIndex

  console.log('✅ Vault created successfully!')
  console.log('Vault ID:', vaultId)
  console.log(`View at: http://localhost:3000/vault/${vaultId}`)

  // ========================================
  // Step 2: Deposit XRP into Vault
  // ========================================
  console.log('\n💵 Depositing funds into Vault...')

  const depositAmount = '10000000' // 10 XRP in drops
  const vaultDepositTx = {
    TransactionType: 'VaultDeposit',
    Account: depositorWallet.address,
    VaultID: vaultId,
    Amount: depositAmount,
  }

  const depositResult = await client.submitAndWait(vaultDepositTx, {
    wallet: depositorWallet,
  })

  if (depositResult.result.meta.TransactionResult !== 'tesSUCCESS') {
    throw new Error(
      `Vault deposit failed: ${depositResult.result.meta.TransactionResult}`,
    )
  }

  console.log(`✅ Deposited ${xrpl.dropsToXrp(depositAmount)} XRP into vault`)

  // ========================================
  // Step 3: Create Three Loan Brokers with varying configs
  // ========================================
  console.log('\n🏦 Creating Loan Brokers...\n')

  const brokerConfigs = [
    { name: 'Broker Alpha' },
    { name: 'Broker Beta' },
    { name: 'Broker Gamma' },
  ]

  const brokerIds = []

  for (const config of brokerConfigs) {
    console.log(`Creating ${config.name}...`)

    // Use minimal transaction like lendingSetup.js - extra fields cause signature issues
    const loanBrokerSetTx = {
      TransactionType: 'LoanBrokerSet',
      Account: vaultOwnerWallet.address,
      VaultID: vaultId,
    }

    const brokerResult = await client.submitAndWait(loanBrokerSetTx, {
      wallet: vaultOwnerWallet,
      autofill: true,
    })

    if (brokerResult.result.meta.TransactionResult !== 'tesSUCCESS') {
      console.error(
        `❌ ${config.name} creation failed:`,
        brokerResult.result.meta.TransactionResult,
      )
      continue
    }

    // Extract Loan Broker ID from metadata
    const brokerCreatedNode = brokerResult.result.meta.AffectedNodes.find(
      (node) =>
        node.CreatedNode && node.CreatedNode.LedgerEntryType === 'LoanBroker',
    )
    const brokerId = brokerCreatedNode.CreatedNode.LedgerIndex

    brokerIds.push({
      name: config.name,
      id: brokerId,
      config,
    })

    console.log(`  ✅ ${config.name} created`)
    console.log(`  ID: ${brokerId}\n`)
  }

  // ========================================
  // Step 4: Create Three Loans for Each Broker
  // ========================================
  console.log('\n💰 Creating Loans...\n')

  // Suppress console warning from autofilling LoanSet
  const originalWarn = console.warn
  console.warn = () => {}

  const allLoans = []

  for (const broker of brokerIds) {
    console.log(`Creating loans for ${broker.name}...`)

    // Define 3 loans with different configurations
    // PrincipalRequested is in drops (1 XRP = 1,000,000 drops)
    // InterestRate is in basis points (500 = 5%)
    const loanConfigs = [
      {
        name: 'Loan 1',
        PrincipalRequested: '2000000', // 2 XRP
        InterestRate: 500, // 5%
        PaymentTotal: 1,
        PaymentInterval: 2592000, // 30 days
      },
      {
        name: 'Loan 2',
        PrincipalRequested: '3000000', // 3 XRP
        InterestRate: 500, // 5%
        PaymentTotal: 1,
        PaymentInterval: 2592000, // 30 days
      },
      {
        name: 'Loan 3',
        PrincipalRequested: '1000000', // 1 XRP
        InterestRate: 500, // 5%
        PaymentTotal: 1,
        PaymentInterval: 2592000, // 30 days
      },
    ]

    for (const loanConfig of loanConfigs) {
      try {
        // Prepare LoanSet transaction
        const loanSetTx = await client.autofill({
          TransactionType: 'LoanSet',
          Account: vaultOwnerWallet.address,
          Counterparty: borrowerWallet.address,
          LoanBrokerID: broker.id,
          PrincipalRequested: loanConfig.PrincipalRequested,
          InterestRate: loanConfig.InterestRate,
          PaymentTotal: loanConfig.PaymentTotal,
          PaymentInterval: loanConfig.PaymentInterval,
        })

        // Loan broker signs first
        const loanBrokerSignature = vaultOwnerWallet.sign(loanSetTx)
        const decodedLoanBrokerSignature = xrpl.decode(
          loanBrokerSignature.tx_blob,
        )

        // Borrower signs second
        const keypair = deriveKeypair(borrowerWallet.seed)
        const encodedTx = encodeForSigning(decodedLoanBrokerSignature)
        const borrowerSignature = sign(encodedTx, keypair.privateKey)

        const counterpartySignature = {
          SigningPubKey: keypair.publicKey,
          TxnSignature: borrowerSignature,
        }

        // Form fully signed LoanSet transaction
        const signedLoanSetTx = decodedLoanBrokerSignature
        signedLoanSetTx.CounterpartySignature = counterpartySignature

        // Submit and wait for validation
        const loanResult = await client.submitAndWait(signedLoanSetTx)

        if (loanResult.result.meta.TransactionResult !== 'tesSUCCESS') {
          console.error(
            `  ❌ ${loanConfig.name} creation failed:`,
            loanResult.result.meta.TransactionResult,
          )
          continue
        }

        // Extract Loan ID from metadata
        const loanCreatedNode = loanResult.result.meta.AffectedNodes.find(
          (node) =>
            node.CreatedNode && node.CreatedNode.LedgerEntryType === 'Loan',
        )
        const loanId = loanCreatedNode.CreatedNode.LedgerIndex

        allLoans.push({
          brokerName: broker.name,
          loanName: loanConfig.name,
          loanId,
          principal: loanConfig.PrincipalRequested,
          interestRate: loanConfig.InterestRate,
        })

        console.log(`  ✅ ${loanConfig.name} created (ID: ${loanId})`)

        // if (!createImpairedLoan) {
        //   await new Promise(r => setTimeout(r, 1000));

        //   const loanManageTx = await client.autofill({
        //     TransactionType: 'LoanManage',
        //     Account: broker.address,
        //     Flags: 0x00020000,
        //     LoanID: loanId,
        //   });
        //   console.log('Creating an impaired loan: ', loanManageTx)
        //   await client.submitAndWait(loanManageTx);
        //   createImpairedLoan = true;
        // }
      } catch (error) {
        console.error(`  ❌ Error creating ${loanConfig.name}:`, error.message)
      }
    }
    console.log('')
  }

  // Restore console.warn
  console.warn = originalWarn

  // ========================================
  // Summary
  // ========================================
  console.log(`\n${'='.repeat(70)}`)
  console.log('🎉 SETUP COMPLETE!')
  console.log('='.repeat(70))
  console.log('\n📋 Summary:')
  console.log(`\nVault ID: ${vaultId}`)
  console.log(`Asset: XRP`)
  console.log(`Owner: ${vaultOwnerWallet.address}`)
  console.log(`Depositor: ${depositorWallet.address}`)
  console.log(`Borrower: ${borrowerWallet.address}`)
  console.log(`Total Deposited: ${xrpl.dropsToXrp(depositAmount)} XRP`)
  console.log(`\nLoan Brokers Created: ${brokerIds.length}`)
  brokerIds.forEach((broker, index) => {
    console.log(`\n${index + 1}. ${broker.name}`)
    console.log(`   ID: ${broker.id}`)
    const brokerLoans = allLoans.filter((l) => l.brokerName === broker.name)
    if (brokerLoans.length > 0) {
      console.log(`   Loans: ${brokerLoans.length}`)
      brokerLoans.forEach((loan) => {
        console.log(
          `     - ${loan.loanName}: ${loan.principal} XRP @ ${(loan.interestRate * 100).toFixed(2)}%`,
        )
      })
    }
  })
  console.log(`\n💰 Total Loans Created: ${allLoans.length}`)
  console.log(`\n🌐 View Vault: http://localhost:3000/vault/${vaultId}`)
  console.log(`${'='.repeat(70)}\n`)

  await client.disconnect()
}

createVaultAndBrokers().catch(console.error)
