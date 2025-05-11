// Define sounds used in the application

class SoundManager {
  private sounds: Record<string, HTMLAudioElement> = {};
  private soundEnabled = true;

  constructor() {
    // Create audio elements for each sound
    this.sounds = {
      rankUp: new Audio('https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3'),
      achievement: new Audio('https://cdn.freesound.org/previews/536/536108_3797507-lq.mp3'),
      buttonClick: new Audio('https://cdn.freesound.org/previews/240/240776_4107740-lq.mp3')
    };

    // Preload sounds
    Object.values(this.sounds).forEach(sound => {
      sound.load();
      sound.volume = 0.5;
    });
  }

  // Enable or disable sounds
  enableSounds(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  // Play a sound if sounds are enabled
  play(soundName: 'rankUp' | 'achievement' | 'buttonClick'): void {
    if (!this.soundEnabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      // Reset the audio to the beginning to allow replaying
      sound.currentTime = 0;
      sound.play().catch(err => {
        console.warn('Error playing sound:', err);
      });
    }
  }
}

// Create a singleton instance
const soundManager = new SoundManager();

export default soundManager;
