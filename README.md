# 🔐 Solana Vault

A secure on-chain vault built with Rust and Anchor framework on the Solana blockchain. This project enables users to create encrypted note storage with owner-bound access control.

## 🚀 Features

- Create personalized vaults (PDAs)
- Store encrypted notes on-chain
- Retrieve notes with strict access control
- Anchor-based account validation and error handling
- Fully tested using TypeScript

## 🛠️ Tech Stack

- **Solana**: Blockchain platform
- **Rust**: Smart contract language
- **Anchor**: Framework for Solana smart contract development
- **TypeScript**: For integration tests

## 📦 Folder Structure

```
solana-vault/
│
├── programs/
│   └── solana-vault/
│       ├── src/
│       │   ├── lib.rs               # Entry point
│       │   ├── state.rs             # Vault state definitions
│       │   └── instructions/
│       │       ├── initialize_vault.rs
│       │       ├── store_note.rs
│       │       └── get_note.rs
│
├── tests/
│   └── vault.ts                     # TypeScript integration tests
│
├── Anchor.toml                      # Anchor config
├── Cargo.toml                       # Rust workspace config
├── package.json                     # JS deps
├── tsconfig.json                    # TS config
└── README.md
```

## 📖 Instructions

### Initialize Vault

```ts
await program.methods
  .initializeVault()
  .accounts({
    vault: vaultPda,
    user: provider.wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### Store Note

```ts
await program.methods
  .storeNote("Encrypted note here")
  .accounts({
    vault: vaultPda,
    user: provider.wallet.publicKey,
  })
  .rpc();
```

### Get Note (read-only)

```ts
const account = await program.account.vault.fetch(vaultPda);
console.log("Stored note:", account.encryptedNote);
```

## 🧪 Testing

Run the test suite with:

```bash
anchor test
```

Result:

```bash
solana_vault
Initialize vault transaction signature: 24RgfdCgFXBarHjJnYNQha8ApLvigueFBE6jcM4MkGhZDt3BhxFKuhKN1JammRo5skLrnCsdngNGRMj5JpWphqtr
    ✔ Initializes a vault (349ms)
Store note transaction signature: 37mXW37mwbNmKnytYPoJeDThM5YRtMmDAFPPxsC8zi3QrQYxxcm6XbEGmYkQjrPUwTuNGoYofDYFcvGexFKnsffs
    ✔ Stores a note in the vault (425ms)
Get note transaction signature: 3fctDZ2DqHnxLTkDEhUMMMeBsCr4tppJoVnHY73TLocWGA6ihH4PZzJjiFZcNks76Hxe4QG5dMtG7PN5jN9Sg7Ue
Retrieved note: This is my secret note!
    ✔ Retrieves a note from the vault (418ms)
    ✔ Fails to store a note that's too long
Update note transaction signature: 3B5SJVhHCj8Z7sXDeGnbnYZmp71wpBSfqUuA1KkwTSPzeGxomknwF3AA5YgPeryBuJsy4eKp2pF5QNLoLEfrmqkQ
    ✔ Updates an existing note (422ms)


  5 passing (2s)

Done in 4.39s.
```

## ✅ Security

- Vaults are Program Derived Addresses (PDAs), owned and derived per user
- Only the original creator (owner) can modify stored content
- Overflow protection and signer checks in all instructions

## 📚 Learning Objectives

This project demonstrates:

- Anchor program structure and modular design
- Custom account types and PDAs with seeds + bump
- Instruction handlers and context management
- Secure data storage and read-only access
- End-to-end tests in TypeScript

## 📄 License

MIT – feel free to use and extend.