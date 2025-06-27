use anchor_lang::prelude::*;
use crate::error::*;
use crate::state::*;

#[derive(Accounts)]
pub struct StoreNote<'info> {
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump = vault.bump,
        has_one = owner @ crate::error::VaultError::Unauthorized
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: This account is the owner of the vault
    pub owner: AccountInfo<'info>,
}

pub fn handler(ctx: Context<StoreNote>, encrypted_note: String) -> Result<()> {
    let vault = &mut ctx.accounts.vault;

    // Validate note length
    require!(encrypted_note.len() <= Vault::MAX_NOTE_SIZE, VaultError::NoteTooLong);

    //store the encrypted note
    vault.encrypted_note = encrypted_note;
    vault.updated_at = Clock::get()?.unix_timestamp;

    msg!("Note stored successfully for user: {}", vault.owner);

    Ok(())
}