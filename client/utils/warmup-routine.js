const axiosInstance = require('./interceptors');

// Warm-up Funktion für REST oder GraphQL basierend auf dem API-Typ
const warmUpServer = async (api) => {
  const actualHost = process.env.HOST || 'localhost:4000';

  try {
    if (api === "REST") {
      for (let i = 0; i < 5; i++){
        // Warm-up API-Call für REST
        await axiosInstance.get(`http://${actualHost}/health-check`);
      }
      
    } else if (api === "GraphQL") {
      for (let i = 0; i < 5; i++) {
        // Warm-up API-Call für GraphQL
      await axiosInstance.post(`http://${actualHost}/graphql`, {
        query: `{
                  digitalIdentitiesByStatus(status: "suspended", limit: 1){
                    id
                  }
              }`,
        });
      }
      
    } else {
      console.log("Unknown API type for warm-up.");
    }
    console.log(`Warm-up completed for ${api}.`);
  } catch (error) {
    console.error(`Error during warm-up for ${api}:`, error);
  }
};

module.exports = { warmUpServer };
