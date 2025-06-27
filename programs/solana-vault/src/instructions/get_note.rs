use anchor_lang::prelude::*;
use crate::error::*;
use crate::state::*;

#[derive(Accounts)]
pub struct GetNote<'info> {
    #[account(
        seeds = [b"vault", user.key().as_ref()],
        bump = vault.bump,
        has_one = owner @ crate::error::VaultError::Unauthorized
    )]
    pub vault: Account<'info, Vault>,

    pub user: Signer<'info>,

    /// CHECK: This account is the owner of the vault
    pub owner: AccountInfo<'info>,
}

pub fn handler(ctx: Context<GetNote>) -> Result<()> {
    let vault = &ctx.accounts.vault;

    // Check if vault has any note
    require!(!vault.encrypted_note.is_empty(), VaultError::EmptyVault);

    msg!("Note retrieved for user: {}", vault.owner);
    msg!("Note content: {}", vault.encrypted_note);
    Ok(())
}