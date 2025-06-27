use anchor_lang::prelude::*;

#[error_code]
pub enum VaultError {
    #[msg("Note is too long. Maximum 1000 characters allowed.")]
    NoteTooLong,

    #[msg("Unauthorized access. Only vault owner can perform this action.")]
    Unauthorized,

    #[msg("Vault is empty. No note stored yet.")]
    EmptyVault,

    #[msg("Invalid encryption key provided.")]
    InvalidEncryptionKey,
}