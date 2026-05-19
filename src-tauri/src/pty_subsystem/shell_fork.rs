// Cross-platform native shell wrapper tracking zsh, bash, and pwsh
pub struct ShellFork {
    pub shell_path: String,
}

impl ShellFork {
    pub fn new() -> Self {
        Self { shell_path: "/bin/zsh".to_string() }
    }
}
