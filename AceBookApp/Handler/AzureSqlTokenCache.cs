using Azure.Core;
using Azure.Identity;

namespace AceBookApp.Handler
{
    public static class AzureSqlTokenCache
    {
        private static string _accessToken;
        private static DateTimeOffset _expiresAt;

        public static string GetAccessToken()
        {
            if (_accessToken != null && DateTimeOffset.UtcNow < _expiresAt)
            {
                return _accessToken; // Return cached token
            }

            var credential = new DefaultAzureCredential();
            var tokenRequestContext = new TokenRequestContext(new[] { "https://database.windows.net/.default" });

            var token = credential.GetToken(tokenRequestContext, CancellationToken.None);

            _accessToken = token.Token;
            _expiresAt = token.ExpiresOn.AddMinutes(-5); // Renew 5 min early

            return _accessToken;
        }
    }

}
