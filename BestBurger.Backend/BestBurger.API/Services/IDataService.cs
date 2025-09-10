using BestBurger.API.Models;

namespace BestBurger.API.Services
{
    public interface IDataService
    {
        Task<List<Road>> LoadRoadsAsync();
        Task<List<Road>> GetFilteredRoadsAsync(AnalysisRequest request);
        Task<AnalysisResponse> AnalyzeRoadsAsync(AnalysisRequest request);
    }
}
