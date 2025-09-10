using BestBurger.API.Models;
using CsvHelper;
using System.Globalization;

namespace BestBurger.API.Services
{
    public class DataService : IDataService
    {
        private readonly ILogger<DataService> _logger;
        private readonly string _dataPath;
        private List<Road>? _cachedRoads;

        public DataService(ILogger<DataService> logger, IWebHostEnvironment environment)
        {
            _logger = logger;
            _dataPath = Path.Combine(environment.ContentRootPath, "Data", "selangor_roads_mock.csv");
        }

        public async Task<List<Road>> LoadRoadsAsync()
        {
            if (_cachedRoads != null)
                return _cachedRoads;

            try
            {
                _logger.LogInformation("Loading roads data from {DataPath}", _dataPath);
                
                var roads = new List<Road>();
                
                using var reader = new StreamReader(_dataPath);
                using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
                
                var records = csv.GetRecords<dynamic>();
                
                foreach (var record in records)
                {
                    var road = new Road
                    {
                        Id = record.id,
                        RoadName = record.road_name,
                        City = record.city,
                        RoadType = record.road_type,
                        Lanes = int.Parse(record.lanes.ToString()),
                        SpeedKph = int.Parse(record.speed_kph.ToString()),
                        TrafficIndex = double.Parse(record.traffic_index.ToString()),
                        Direction = record.direction,
                        Wkt = record.wkt
                    };
                    roads.Add(road);
                }

                _cachedRoads = roads;
                _logger.LogInformation("Loaded {Count} roads successfully", roads.Count);
                return roads;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading roads data");
                throw;
            }
        }

        public async Task<List<Road>> GetFilteredRoadsAsync(AnalysisRequest request)
        {
            var roads = await LoadRoadsAsync();
            
            return roads.Where(road =>
                (string.IsNullOrEmpty(request.City) || road.City.Equals(request.City, StringComparison.OrdinalIgnoreCase)) &&
                (string.IsNullOrEmpty(request.RoadType) || road.RoadType.Equals(request.RoadType, StringComparison.OrdinalIgnoreCase))
            ).ToList();
        }

        public async Task<AnalysisResponse> AnalyzeRoadsAsync(AnalysisRequest request)
        {
            var filteredRoads = await GetFilteredRoadsAsync(request);
            
            // Sort by traffic index (highest first) and return simple list
            var sortedRoads = filteredRoads.OrderByDescending(road => road.TrafficIndex).ToList();

            return new AnalysisResponse
            {
                Roads = sortedRoads
            };
        }



    }
}
