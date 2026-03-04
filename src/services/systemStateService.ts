
//C:\repository\proj-full-stack-backend\src\services\sistem\systemStateService.ts

export type SystemMode = 'LEVE' | 'DEV';

class SystemStateService {
  private initialized = false;
  private mode: SystemMode = 'LEVE';

  markInitialized() {
    this.initialized = true;
  }

  isInitialized() {
    return this.initialized;
  }

  getMode(): SystemMode {
    return this.mode;
  }

  setDevMode() {
    this.mode = 'DEV';
  }

  setLeveMode() {
    this.mode = 'LEVE';
  }
}

export const systemStateService = new SystemStateService();

