import fetchIntercept from 'fetch-intercept';

export const AuthInterceptor = () => {
  fetchIntercept.register({
    // request: function (url, config) {
    //   // Modify the url or config here
    //   config.headers.name = 'Aravindh';
    //   console.log(config);
    //   return [url, config];
    // },

    // requestError: function (error) {
    //   // Called when an error occured during another 'request' interceptor call
    //   return Promise.reject(error);
    // },

    response: function (response) {
      // Modify the reponse object
      return response;
    },

    responseError: function (error) {
      // Handle an fetch error
      return Promise.reject(error);
    },
  });
};