import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaVault } from "../target/types/solana_vault";
import { expect } from "chai";

describe("solana_vault", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaVault as Program<SolanaVault>;
  const user = provider.wallet;

  let vaultPda: anchor.web3.PublicKey;
  let vaultBump: number;

  before(async () => {
    // Derive the PDA for the user's vault
    [vaultPda, vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), user.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initializes a vault", async () => {
    try {
      const tx = await program.methods
        .initializeVault()
        .accounts({
          vault: vaultPda,
          user: user.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Initialize vault transaction signature:", tx);

      // Fetch the vault account
      const vaultAccount = await program.account.vault.fetch(vaultPda);
      
      expect(vaultAccount.owner.toString()).to.equal(user.publicKey.toString());
      expect(vaultAccount.encryptedNote).to.equal("");
      expect(vaultAccount.bump).to.equal(vaultBump);
    } catch (error) {
      console.error("Error initializing vault:", error);
      throw error;
    }
  });

  it("Stores a note in the vault", async () => {
    const testNote = "This is my secret note!";
    
    try {
      const tx = await program.methods
        .storeNote(testNote)
        .accounts({
          vault: vaultPda,
          user: user.publicKey,
          owner: user.publicKey,
        })
        .rpc();

      console.log("Store note transaction signature:", tx);

      // Fetch the updated vault account
      const vaultAccount = await program.account.vault.fetch(vaultPda);
      
      expect(vaultAccount.encryptedNote).to.equal(testNote);
      expect(vaultAccount.owner.toString()).to.equal(user.publicKey.toString());
    } catch (error) {
      console.error("Error storing note:", error);
      throw error;
    }
  });

  it("Retrieves a note from the vault", async () => {
    try {
      const tx = await program.methods
        .getNote()
        .accounts({
          vault: vaultPda,
          user: user.publicKey,
          owner: user.publicKey,
        })
        .rpc();

      console.log("Get note transaction signature:", tx);
      
      // Fetch the vault account to verify the note
      const vaultAccount = await program.account.vault.fetch(vaultPda);
      console.log("Retrieved note:", vaultAccount.encryptedNote);
      expect(vaultAccount.encryptedNote).to.equal("This is my secret note!");
    } catch (error) {
      console.error("Error retrieving note:", error);
      throw error;
    }
  });

  it("Fails to store a note that's too long", async () => {
    const longNote = "a".repeat(1010); // Exceeds MAX_NOTE_SIZE of 1000
    
    try {
      await program.methods
        .storeNote(longNote)
        .accounts({
          vault: vaultPda,
          user: user.publicKey,
          owner: user.publicKey,
        })
        .rpc();
      
      // Should not reach here
      expect.fail("Expected transaction to fail due to note length");
    } catch (error) {
      expect(error.toString()).to.satisfy((str: string) => 
      str.includes("NoteTooLong") || str.includes("encoding overruns")
    );
    }
  });

  it("Updates an existing note", async () => {
    const updatedNote = "This is my updated secret note!";
    
    try {
      const tx = await program.methods
        .storeNote(updatedNote)
        .accounts({
          vault: vaultPda,
          user: user.publicKey,
          owner: user.publicKey,
        })
        .rpc();

      console.log("Update note transaction signature:", tx);

      // Fetch the updated vault account
      const vaultAccount = await program.account.vault.fetch(vaultPda);
      
      expect(vaultAccount.encryptedNote).to.equal(updatedNote);
      
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  });
});