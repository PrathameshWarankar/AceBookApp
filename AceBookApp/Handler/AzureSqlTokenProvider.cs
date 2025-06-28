using Azure.Core;
using Azure.Identity;
using Microsoft.Extensions.Caching.Memory;

namespace AceBookApp.Handler
{
    public class AzureSqlTokenProvider
    {
        private readonly IMemoryCache _cache;
        private readonly DefaultAzureCredential _credential = new();

        public AzureSqlTokenProvider(IMemoryCache cache)
        {
            _cache = cache;
        }

        public string GetToken()
        {
            return _cache.GetOrCreate("AzureSqlAccessToken", entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(55);

                var tokenRequestContext = new TokenRequestContext(new[] { "https://database.windows.net/.default" });
                var token = _credential.GetToken(tokenRequestContext, CancellationToken.None);

                return token.Token;
            });
        }
    }
}
