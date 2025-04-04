// src/services/api.js
// Version modifiée qui simule des appels API sans backend réel

// Simuler un délai réseau pour rendre la démo plus réaliste
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Simuler une réponse API
const mockResponse = (data, status = 200) => ({
  data,
  status,
  headers: {},
  config: {},
  statusText: status === 200 ? 'OK' : 'Error'
});

// API mock qui remplace axios
const api = {
  defaults: {
    headers: {
      common: {}
    }
  },
  
  // Simuler GET
  async get(url) {
    console.log(`🔄 Mock API GET: ${url}`);
    await simulateDelay();
    
    // Cela sera remplacé par la logique spécifique dans chaque service
    return mockResponse({});
  },
  
  // Simuler POST
  async post(url, data) {
    console.log(`🔄 Mock API POST: ${url}`, data);
    await simulateDelay();
    
    // Cela sera remplacé par la logique spécifique dans chaque service
    return mockResponse({});
  },
  
  // Simuler PATCH
  async patch(url, data) {
    console.log(`🔄 Mock API PATCH: ${url}`, data);
    await simulateDelay();
    
    // Cela sera remplacé par la logique spécifique dans chaque service
    return mockResponse({});
  },
  
  // Simuler DELETE
  async delete(url) {
    console.log(`🔄 Mock API DELETE: ${url}`);
    await simulateDelay();
    
    // Cela sera remplacé par la logique spécifique dans chaque service
    return mockResponse({});
  }
};

export default api;