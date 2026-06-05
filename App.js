import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, Text, View, TextInput, ActivityIndicator, 
  ScrollView, RefreshControl, Keyboard 
} from 'react-native';

// --- UTILITY FUNCTIONS ---
// Mapping kode WMO ke emoji dan deskripsi
const getWeatherDescription = (code) => {
  const weatherMap = {
    0: { label: 'Cerah', emoji: '☀️' },
    1: { label: 'Cerah Berawan', emoji: '🌤️' },
    2: { label: 'Berawan', emoji: '⛅' },
    3: { label: 'Mendung', emoji: '☁️' },
    45: { label: 'Berkabut', emoji: '🌫️' },
    48: { label: 'Kabut Tebal', emoji: '🌫️' },
    51: { label: 'Gerimis Ringan', emoji: '🌧️' },
    53: { label: 'Gerimis', emoji: '🌧️' },
    55: { label: 'Gerimis Lebat', emoji: '🌧️' },
    61: { label: 'Hujan Ringan', emoji: '🌧️' },
    63: { label: 'Hujan', emoji: '🌧️' },
    65: { label: 'Hujan Lebat', emoji: '🌧️☔' },
    71: { label: 'Salju Ringan', emoji: '❄️' },
    73: { label: 'Salju', emoji: '❄️' },
    75: { label: 'Salju Lebat', emoji: '❄️⛄' },
    95: { label: 'Badai Petir', emoji: '⛈️' },
  };
  return weatherMap[code] || { label: 'Tidak Diketahui', emoji: '❓' };
};

// Konversi derajat ke arah mata angin (Fitur Level 2)
const getWindDirection = (degree) => {
  const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
  return directions[Math.round(degree / 45) % 8];
};

export default function App() {
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [status, setStatus] = useState('empty'); // empty | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fungsi utama untuk fetch 2 langkah
  const fetchWeather = async (cityName, signal) => {
    try {
      setStatus('loading');
      setErrorMessage('');

      // Langkah 1: Geocoding
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=id`;
      const geoRes = await fetch(geoUrl, { signal });
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Kota tidak ditemukan, coba nama lain ya.');
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Langkah 2: Forecast
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const weatherRes = await fetch(weatherUrl, { signal });
      const weatherResult = await weatherRes.json();

      const current = weatherResult.current_weather;

      setWeatherData({
        city: name,
        country: country,
        temp: current.temperature,
        windspeed: current.windspeed,
        winddirection: getWindDirection(current.winddirection),
        isDay: current.is_day,
        condition: getWeatherDescription(current.weathercode)
      });
      
      setStatus('success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        setStatus('error');
        setErrorMessage(error.message || 'Gagal mengambil data jaringan.');
      }
    }
  };

  // Debounce dan AbortController di dalam useEffect
  useEffect(() => {
    if (!searchInput.trim()) {
      setStatus('empty');
      setWeatherData(null);
      return;
    }

    const abortController = new AbortController();

    // Set delay 500ms
    const timerId = setTimeout(() => {
      fetchWeather(searchInput, abortController.signal);
    }, 500);

    // Cleanup function: batalkan timer & request sebelumnya
    return () => {
      clearTimeout(timerId);
      abortController.abort();
    };
  }, [searchInput]);

  // Handler untuk pull-to-refresh
  const onRefresh = useCallback(() => {
    if (searchInput.trim()) {
      setRefreshing(true);
      fetchWeather(searchInput).then(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  }, [searchInput]);

  // Background Dinamis (Fitur Level 2)
  const getBackgroundColor = () => {
    if (status !== 'success' || !weatherData) return '#f0f4f8';
    return weatherData.isDay === 1 ? '#87CEEB' : '#2c3e50';
  };

  const getTextColor = () => {
    if (status !== 'success' || !weatherData) return '#333';
    return weatherData.isDay === 1 ? '#333' : '#fff';
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={[styles.header, { color: getTextColor() }]}>WeatherFinder ⛅</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ketik nama kota (misal: Jakarta)..."
        placeholderTextColor="#888"
        value={searchInput}
        onChangeText={setSearchInput}
      />

      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        {status === 'empty' && (
          <Text style={[styles.hint, { color: getTextColor() }]}>
            Mulai ketik nama kota untuk melihat cuaca.
          </Text>
        )}

        {status === 'loading' && (
          <ActivityIndicator size="large" color={weatherData?.isDay === 0 ? '#fff' : '#0000ff'} />
        )}

        {status === 'error' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {status === 'success' && weatherData && (
          <View style={styles.card}>
            <Text style={styles.cityText}>{weatherData.city}, {weatherData.country}</Text>
            <Text style={styles.emojiText}>{weatherData.condition.emoji}</Text>
            <Text style={styles.tempText}>{weatherData.temp}°C</Text>
            <Text style={styles.descText}>{weatherData.condition.label}</Text>
            
            <View style={styles.extraInfo}>
              <Text style={styles.extraText}>
                💨 Angin: {weatherData.windspeed} km/j ({weatherData.winddirection})
              </Text>
              <Text style={styles.extraText}>
                {weatherData.isDay === 1 ? '☀️ Waktu Siang' : '🌙 Waktu Malam'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { 
    backgroundColor: '#fff', padding: 15, borderRadius: 10, 
    fontSize: 16, marginBottom: 20, elevation: 2, shadowColor: '#000', 
    shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } 
  },
  contentContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 16, fontStyle: 'italic', opacity: 0.7 },
  errorBox: { backgroundColor: '#ffe6e6', padding: 15, borderRadius: 8 },
  errorText: { color: '#d9534f', fontWeight: 'bold', textAlign: 'center' },
  card: { 
    backgroundColor: '#fff', padding: 30, borderRadius: 20, 
    alignItems: 'center', width: '100%', elevation: 5, shadowColor: '#000', 
    shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } 
  },
  cityText: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  emojiText: { fontSize: 60, marginBottom: 10 },
  tempText: { fontSize: 48, fontWeight: 'bold', marginBottom: 5 },
  descText: { fontSize: 20, color: '#555', marginBottom: 20 },
  extraInfo: { 
    marginTop: 15, paddingTop: 15, borderTopWidth: 1, 
    borderColor: '#eee', width: '100%', alignItems: 'center' 
  },
  extraText: { fontSize: 16, color: '#444', marginVertical: 4 }
});