import { useEffect, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import api from "../../config/axios";
import ProductCard from "../productlist/ProductCard";
import { useSearch } from "../../context/SearchContext";

const HomePage = () => {
  const { searchQuery } = useSearch();

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
        "https://paulaschoice.vn/wp-content/uploads/2019/10/paulaschoice.jpg",
      title: "Paula's Choice",
      description:
        "Innovative skincare scientifically proven to rejuvenate skin.",
    },
    {
      id: 3,
      image:
        "https://file.hstatic.net/200000346975/collection/logo_efa7eef91f3a4594a90f502a2f47f2a7.jpg",
      title: "Cosrx",
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
    {
      id: 7,
      image:
        "https://nassifmedspa.co.uk/wp-content/uploads/2023/11/Obagi_2019_Logo_for_block_colour_or_visionary_image-910x512.png",
      title: "Obagi",
      description: "The deepest range of clinical testing (in-vitro and in-vivo) to assess the truly transformative and skin tolerated results on all skin types and tones.",
    },
    {
      id: 8,
      image:
        "https://vcdn.valiram.com/wp-content/themes/valiram/images/logo_big/kiehls.png",
      title: "Kiehl's",
      description: "Kiehl's LLC is an American cosmetics brand retailer that specializes in skin, hair, and body care products.",
    },
  ];
  const [product, setProduct] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [productsRes] = await Promise.all([api.get("/product")]);
      setProduct(productsRes.data);
    };

    fetchData();
  }, []);

  // Banner img
  const bannerImages = [
    {
      id: 1,
      image:
        "https://publicidadymercados.com/wp-content/uploads/2023/02/reverse-skincare-la-tendencia-de-cuidado-de-la-piel-en-redes-sociales-como-funciona.jpg",
      button: "Take a quiz",
      text: "Explore suitable products based on the skin type test",
      slogan: "Healthy skin, powered by science",
      link: "/skinquiz",
    },
    {
      id: 2,
      image:
        "https://liphamymakeup.com/wp-content/uploads/2023/06/skincare-la-gi-648195ccc130b.jpg",
      button: "Shopping now",
      text: "Advanced formulas, visible results",
      slogan: "Understanding your skin starts here",
      link: "/productlist",
    },
    {
      id: 3,
      image: "https://tiki.vn/blog/wp-content/uploads/2023/01/tay-trang.png",
      button: "Explore your skin type",
      text: "Your skin's companion on the journey to perfection",
      slogan: "The science behind your glowing skin",
      link: "/skinquiz",
    },
    {
      id: 4,
      image:
        "https://www.kanvasbeauty.com.au/cdn/shop/files/BANNER_WEBSITE_5_b5f88935-a79c-4f2d-a27b-ca04976006c6_1600x.jpg?v=1672463676",
      button: "Shopping now",
      text: "Scientific skincare, glowing results",
      slogan: "Know your skin, unlock its true potential",
      link: "/productlist",
    },
  ];

  const navigate = useNavigate();

  // Lọc sản phẩm dựa trên search
  const filteredProducts = useMemo(() => {
    return product.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [product, searchQuery]);

  return (
    <div className="bg-white">
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
            {bannerImages.map((image) => (
              <SwiperSlide key={image.id}>
                <div
                  className="w-full h-full flex items-end justify-center bg-cover bg-center"
                  style={{ backgroundImage: `url(${image.image})` }}
                >
                  <div className="bg-transparent bg-opacity-50 p-6 rounded-lg text-white">
                    <h2 className="text-3xl font-bold">{image.slogan}</h2>
                    <p className="text-lg mt-2">{image.text}</p>
                    <button
                      className="mt-4 bg-rose-700 text-white px-6 py-2 rounded-full"
                      onClick={() => navigate(image.link)}
                    >
                      {image.button}
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
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="swiper"
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product.id} className="p-2">
                <div className="scale-90">
                  {" "}
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
