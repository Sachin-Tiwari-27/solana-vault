use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;

use instructions::{get_note::*, initialize_vault::*, store_note::*};

declare_id!("4uWZa2GdP4xDe2kaFyj4emdVvqrTNMnPiKAM6AYShHnj");

#[program]
pub mod solana_vault {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        instructions::initialize_vault::handler(ctx)
    }

    pub fn store_note(ctx: Context<StoreNote>, encrypted_note: String) -> Result<()> {
        instructions::store_note::handler(ctx, encrypted_note)
    }

    pub fn get_note(ctx: Context<GetNote>) -> Result<()> {
        instructions::get_note::handler(ctx)
    }
}






