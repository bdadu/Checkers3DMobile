#!/bin/zsh
# Helper to run CocoaPods with Homebrew Ruby 3.2 to avoid SIGBUS on Ruby 3.4
export PATH="/opt/homebrew/opt/ruby@3.2/bin:$PATH"
exec /opt/homebrew/lib/ruby/gems/3.2.0/bin/pod "$@"
