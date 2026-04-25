export async function getTucsonWeather() {
  try {
    const pointRes = await fetch("https://api.weather.gov/points/32.2226,-110.9747", {
      headers: { "User-Agent": "OwnPath/1.0 (hackathon demo)" }
    });
    if (!pointRes.ok) throw new Error("NWS points failed");
    const pointData = await pointRes.json();
    const forecastUrl = pointData.properties.forecast;

    const forecastRes = await fetch(forecastUrl, {
      headers: { "User-Agent": "OwnPath/1.0 (hackathon demo)" }
    });
    if (!forecastRes.ok) throw new Error("NWS forecast failed");
    const forecastData = await forecastRes.json();

    const periods = forecastData.properties.periods;
    // Find tomorrow daytime period
    const tomorrow = periods.find(p => !p.isDaytime) || periods[1] || periods[0];
    const dayAfter = periods.find(p => p.isDaytime && periods.indexOf(p) > 0) || periods[2];
    const target = dayAfter || tomorrow;

    const temp = target.temperature;
    const unit = target.temperatureUnit;
    const tempF = unit === "C" ? Math.round(temp * 9/5 + 32) : temp;

    return {
      temp: tempF,
      unit: "F",
      description: target.shortForecast,
      isDangerous: tempF >= 105,
      isHot: tempF >= 100
    };
  } catch {
    // Realistic Tucson fallback for demo
    return { temp: 107, unit: "F", description: "Sunny and Hot", isDangerous: true, isHot: true };
  }
}
