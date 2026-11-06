// Create a singleton instance of the Encore client
import Client from "./encore_client";

// Ensure we include credentials with all API requests
const encoreAPI = new Client("http://localhost:4000", {
    requestInit: {
        credentials: 'include',
    }
})

// Export the full client as default for any other needs
export default encoreAPI;
