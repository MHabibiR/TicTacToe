import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {
  private bgMusic: HTMLAudioElement;
  isMusicEnabled: boolean = true;

  constructor() {
    this.bgMusic = new Audio('../assets/audio/cyberpunk.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.4; 
  }

  currentTab: string = 'mode_selection';
    gameMode: 'pvp' | 'pve' | null = null;
    selectedSymbol: 'X' | 'O' = 'X';
    board: (string | null)[] = Array(9).fill(null);
    currentPlayer: 'X' | 'O' = 'X';
    winner: string | null = null;
    scores = { userX: 0, userO: 0, draw: 0 };

    playMusic() {
      if (this.isMusicEnabled) {
        this.bgMusic.play().catch(err => console.log("Menunggu interaksi user untuk musik"));
      }
    }
  
    toggleMusic(event: any) {
      this.isMusicEnabled = event.detail.checked;
      if (this.isMusicEnabled) {
        this.bgMusic.play();
      } else {
        this.bgMusic.pause();
      }
    }
  
  /* Pilih Mode */
  chooseMode(mode: 'pvp' | 'pve') {
      this.gameMode = mode;
      this.playMusic();

      if (mode === 'pvp') {
        this.currentTab = 'battle'; 
        this.resetGame();
      } else {
        this.currentTab = 'symbol_selection'; 
      }
    }

  /* Get Label untuk Player X */
  getPlayerXLabel(): string {
    if (this.gameMode === 'pve' && this.selectedSymbol === 'X') {
      return 'YOU (X)';
    } else if (this.gameMode === 'pve' && this.selectedSymbol === 'O') {
      return 'COMPUTER (X)';
    }
    return 'PLAYER X';
  }

  /* Get Label untuk Player O */
  getPlayerOLabel(): string {
    if (this.gameMode === 'pve' && this.selectedSymbol === 'O') {
      return 'YOU (O)';
    } else if (this.gameMode === 'pve' && this.selectedSymbol === 'X') {
      return 'COMPUTER (O)';
    }
    return 'PLAYER O';
  }

  /* 2. Pilih Simbol  */
  startGame(symbol: 'X' | 'O') {
    this.selectedSymbol = symbol;
    this.currentTab = 'battle';
    this.resetGame();
  }

  /* 3. Aksi Klik */
  makeMove(index: number) {
    if (this.board[index] || this.winner) return;
    if (this.gameMode === 'pve' && this.currentPlayer !== this.selectedSymbol) return;
    this.board[index] = this.currentPlayer;

    if (!this.checkWinner()) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

      if (this.gameMode === 'pve') {
        setTimeout(() => this.makeAIMove(), 500);
      }
    }
  }

  /* AI sederhana */
  makeAIMove() {
    if (this.winner || this.gameMode === 'pvp') return;

    const emptyIndices = this.board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
    if (emptyIndices.length > 0) {
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      this.board[randomIndex] = this.currentPlayer;
      
      if (!this.checkWinner()) {
        this.currentPlayer = this.selectedSymbol;
      }
    }
  }

  /* Kembali ke Pilih Mode */
  backToMode() {
  this.currentTab = 'mode_selection';
  this.gameMode = null;
  this.winner = null;
  this.board = Array(9).fill(null);
  }

  /* Cek Pemenang */
  checkWinner(): boolean {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let [a, b, c] of lines) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        this.winner = this.board[a];
        if (this.winner === 'X') this.scores.userX++;
        else this.scores.userO++;
        return true;
      }
    }
    if (!this.board.includes(null)) {
      this.winner = 'Draw';
      this.scores.draw++;
      return true;
    }
    return false;
  }

  /* Reset Game */
  resetGame() {
      this.board = Array(9).fill(null);
      this.winner = null;
      this.currentPlayer = 'X';

      // Jalankan AI jika mode PvE dan AI adalah X
      if (this.gameMode === 'pve' && this.selectedSymbol === 'O') {
        setTimeout(() => this.makeAIMove(), 600);
      }
    }

  /* Restart game*/
  fullRestart() {
      this.scores = { userX: 0, userO: 0, draw: 0 };
      this.currentTab = 'mode_selection';
      this.gameMode = null;
    }
  }