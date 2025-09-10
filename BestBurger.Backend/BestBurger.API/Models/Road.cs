using System.ComponentModel.DataAnnotations;

namespace BestBurger.API.Models
{
    public class Road
    {
        public string Id { get; set; } = string.Empty;
        public string RoadName { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string RoadType { get; set; } = string.Empty;
        public int Lanes { get; set; }
        public int SpeedKph { get; set; }
        public double TrafficIndex { get; set; }
        public string Direction { get; set; } = string.Empty;
        public string Wkt { get; set; } = string.Empty;
    }
}
