import { useRef, useState } from "react";

const Api_key: string = import.meta.env.VITE_API_KEY as string;

interface WeatherType {
  type: string;
  img: string;
}

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [showWeather, setShowWeather] = useState<WeatherType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const WeatherTypes: WeatherType[] = [
    {
      type: "Clear",
      img: "https://cdn-icons-png.flaticon.com/512/6974/6974833.png",
    },
    {
      type: "Rain",
      img: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
    },
    {
      type: "Snow",
      img: "https://cdn-icons-png.flaticon.com/512/642/642102.png",
    },
    {
      type: "Clouds",
      img: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    },
    {
      type: "Haze",
      img: "https://cdn-icons-png.flaticon.com/512/1197/1197102.png",
    },
    {
      type: "Smoke",
      img: "https://cdn-icons-png.flaticon.com/512/4380/4380458.png",
    },
    {
      type: "Mist",
      img: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",
    },
    {
      type: "Drizzle",
      img: "https://cdn-icons-png.flaticon.com/512/3076/3076129.png",
    },
  ];

  const fetchWeather = async () => {
    const cityName = inputRef.current?.value;
    if (!cityName) return;

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${Api_key}`;
    setLoading(true);
    try {
      const response = await fetch(URL);
      const data = await response.json();

      if (response.ok) {
        setApiData(data);
        setShowWeather(
          WeatherTypes.filter(
            (weather) => weather.type === data.weather[0]?.main
          )
        );
      } else {
        setShowWeather([
          {
            type: "Not Found",
            img: "https://cdn-icons-png.flaticon.com/512/4275/4275497.png",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 h-screen grid place-items-center">
      <h1 className="flex text-3xl font-bold text-center justify-center text-white mt-[-10rem]">
        The Weather App{" "}
      </h1>
      <div className="bg-white w-96 p-4 rounded-md  mt-[-20rem] ">
        <div className="flex items-center justify-between ">
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter Your Location"
            className="text-xl border-b p-1 border-gray-200 font-semibold uppercase flex-1"
          />
          <button onClick={fetchWeather}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/758/758651.png"
              alt="..."
              className="w-8"
            />
          </button>
        </div>
        <div
          className={`duration-300 delay-75 overflow-hidden  ${
            showWeather.length ? "h-[27rem]" : "h-10"
          }`}
        >
          {loading ? (
            <div className="grid place-items-center h-full">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1477/1477009.png"
                alt="..."
                className="w-14 mx-auto mb-2 animate-spin"
              />
            </div>
          ) : (
            showWeather.length > 0 && (
              <div className="text-center flex flex-col gap-6 mt-10">
                {apiData && (
                  <p className="text-xl font-semibold">
                    {apiData?.name + "," + apiData?.sys?.country}
                  </p>
                )}
                <img
                  src={showWeather[0]?.img}
                  alt="..."
                  className="w-52 mx-auto"
                />
                <h3 className="text-2xl font-bold text-zinc-800">
                  {showWeather[0]?.type}
                </h3>

                {apiData && (
                  <div className="flex justify-center">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/7794/7794499.png"
                      alt="..."
                      className="h-9 mt-1"
                    />
                    <h2 className="text-4xl font-extrabold">
                      {apiData?.main?.temp}&#176;C
                    </h2>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
