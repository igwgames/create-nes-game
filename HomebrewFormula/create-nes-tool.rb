class CreateNesGame < Formula
  desc "Create and build NES games using ca65/cc65"
  homepage "https://github.com/igwgames/create-nes-game"
  url "https://github.com/igwgames/create-nes-game/releases/download/v1.0.16/create-nes-game.tar.gz"
  sha256 "119b7a66fff5c620ab4e566ab3746a8f06174fc10995eeb99f5d1a50bbb04c7d"

  def install
    bin.install "create-nes-game"
  end
end
