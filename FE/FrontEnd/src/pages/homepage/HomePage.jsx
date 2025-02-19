import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const HomePage = () => {

  // Trending product
  const trendingProducts = [
    {
      id: 1,
      image:
        "https://mondialbrand.com/wp-content/uploads/2024/01/La-Roche-Posay-Logo.jpg",
      title: "La Roche-Posay",
      description: "Discover dermatologist-tested skincare products.",
    },
    {
      id: 2,
      image:
        "https://alastin.com.au/cdn/shop/files/Alastin_logo.jpg?v=1715578197",
      title: "Alastin Skincare",
      description:
        "Innovative skincare scientifically proven to rejuvenate skin.",
    },
    {
      id: 3,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq2B0R_LcUolRXXqwtFCB6Wb_NUJq6Bv5BZw&s",
      title: "Murad",
      description: "Hydration solutions for radiant and youthful appearance.",
    },
    {
      id: 4,
      image:
        "https://theordinary.com.vn/wp-content/uploads/2021/10/logo-my-pham-the-ordinary.png",
      title: "The Ordinary",
      description: "Affordable and effective skincare backed by science.",
    },
    {
      id: 5,
      image:
        "https://www.gulfcoastdermatology.com/wp-content/uploads/2018/10/cerave.png",
      title: "CeraVe",
      description:
        "Dermatologist-recommended skincare for healthy skin barrier.",
    },
    {
      id: 6,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFcnAOQyG76dYNlJvVJ9AE2NMRRVI-7-WQyg&s",
      title: "Neutrogena",
      description: "Clinically proven skincare for clear and radiant skin.",
    },
  ];

  // New product
  const newProducts = [
    {
      id: 1,
      image:
        "https://pyxis.nymag.com/v1/imgs/27a/c5d/e24e453888890351a0db9f9439bc26a455-06-ordinary-acid.rsquare.w600.jpg",
      title: "New Product 1",
      description: "A brand-new innovative skincare solution.",
    },
    {
      id: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHAV8gBQ8iqkKkhH1e2kVD2NVFYswyQ8x-hR1Op0dZgNqw2nyBg7dB2Vj0Wy5g2BK82uw&usqp=CAU",
      title: "New Product 2",
      description: "Transform your skincare routine today.",
    },
    {
      id: 3,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHAV8gBQ8iqkKkhH1e2kVD2NVFYswyQ8x-hR1Op0dZgNqw2nyBg7dB2Vj0Wy5g2BK82uw&usqp=CAU",
      title: "New Product 3",
      description: "Hydration and nourishment for all skin types.",
    },
    {
      id: 4,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHAV8gBQ8iqkKkhH1e2kVD2NVFYswyQ8x-hR1Op0dZgNqw2nyBg7dB2Vj0Wy5g2BK82uw&usqp=CAU",
      title: "New Product 4",
      description: "Expert-approved formulas for glowing skin.",
    },
    {
      id: 5,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHAV8gBQ8iqkKkhH1e2kVD2NVFYswyQ8x-hR1Op0dZgNqw2nyBg7dB2Vj0Wy5g2BK82uw&usqp=CAU",
      title: "New Product 5",
      description: "An essential skincare product you must try.",
    },
    {
      id: 6,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHAV8gBQ8iqkKkhH1e2kVD2NVFYswyQ8x-hR1Op0dZgNqw2nyBg7dB2Vj0Wy5g2BK82uw&usqp=CAU",
      title: "New Product 6",
      description: "Revitalize your skin with this latest launch.",
    },
  ];

  // Banner img
  const bannerImages = [
    "https://media.post.rvohealth.io/wp-content/uploads/2020/08/11762-BEAUTY_-_No_BS_Guide_to_Discovering_Your_Skin_Type-1200x628-facebook-1200x628.jpg",
    "https://liphamymakeup.com/wp-content/uploads/2023/06/skincare-la-gi-648195ccc130b.jpg",
    "https://tiki.vn/blog/wp-content/uploads/2023/01/tay-trang.png",
    "https://www.allthingshair.com/_next/image/?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fzqgvoczt%2Fproduction%2F51afbb18c75cc5207202feee6a4aba3dd0529b1a-1200x800.jpg%3Fq%3D85%26fit%3Dclip%26auto%3Dformat&w=3840&q=75"
  ];

  return (
    <>
      {/* Header */}
      <Header />

      {/* Body Contain */}
      <div className="container mx-auto px-4 py-8">
        {/* Banner */}
        <div className="relative w-full h-150 text-center text-white">
        <Swiper
          modules={[Navigation, Autoplay]} 
          spaceBetween={0}
          slidesPerView={1}
          navigation={false}
          autoplay={{ delay: 1500, disableOnInteraction: false }} 
          loop={true}
          className="w-full h-full"
        >
          {bannerImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-160 flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="bg-transparent bg-opacity-50 p-6 rounded-lg text-white">
                  <h2 className="text-3xl font-bold">New Year, Fresh Skin</h2>
                  <p className="text-lg mt-2">
                    Explore suitable products based on the skin type test.
                  </p>
                  <button className="mt-4 bg-rose-700 text-white px-6 py-2 rounded-full">
                    Take Quiz Now
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

        {/* Top Trending */}
        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-6">Top Trending</h3>
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="swiper"
          >
            {trendingProducts.map((product) => (
              <SwiperSlide key={product.id} className="p-4">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-bold">{product.title}</h4>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                    <button className="mt-3 text-rose-500 font-semibold">
                      Shop Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* New Products */}
        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-6">New</h3>
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="swiper"
          >
            {newProducts.map((product) => (
              <SwiperSlide key={product.id} className="p-4">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-bold">{product.title}</h4>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                    <button className="mt-3 text-rose-500 font-semibold">
                      Shop Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default HomePage;
