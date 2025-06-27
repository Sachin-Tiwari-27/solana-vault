use anchor_lang::prelude::*;

#[account]
pub struct Vault {
    pub owner: Pubkey,
    pub encrypted_note: String,
    pub created_at: i64,
    pub updated_at: i64,
    pub bump: u8,
}

impl Vault {
    pub const MAX_NOTE_SIZE: usize = 1000;
    pub const SPACE: usize = 8 + 32 + 4 + Self::MAX_NOTE_SIZE + 8 + 8 + 1;
}
