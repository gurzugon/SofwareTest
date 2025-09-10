using BestBurger.API.Models;
using BestBurger.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BestBurger.API.Controllers
{
    [ApiController]
    [Route("api")]
    public class AnalysisController : ControllerBase
    {
        private readonly IDataService _dataService;
        private readonly ILogger<AnalysisController> _logger;

        public AnalysisController(IDataService dataService, ILogger<AnalysisController> logger)
        {
            _dataService = dataService;
            _logger = logger;
        }

        [HttpGet("health")]
        public IActionResult GetHealth()
        {
            return Ok(new { status = "OK", message = "Best Burger Traffic Analysis API is running", timestamp = DateTime.UtcNow });
        }

        [HttpPost("analysis")]
        public async Task<IActionResult> AnalyzeRoads([FromBody] AnalysisRequest request)
        {
            try
            {
                _logger.LogInformation("Analysis request received: City={City}, RoadType={RoadType}", 
                    request.City, request.RoadType);

                var result = await _dataService.AnalyzeRoadsAsync(request);
                
                _logger.LogInformation("Analysis completed. Found {Count} roads", 
                    result.Roads.Count);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during road analysis");
                return StatusCode(500, new { error = "Internal server error during analysis" });
            }
        }
    }
}
