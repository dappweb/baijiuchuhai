import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              中国白酒<span className="text-gold-400">出海中东</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              专注迪拜市场，为中国酒企提供一站式出海解决方案
            </p>
            <Link to="/contact" className="btn-gold inline-block">
              立即咨询
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            为什么选择<span className="text-primary-700">百酒出海</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: '本地化渠道', desc: '深耕迪拜市场，拥有成熟的销售网络' },
              { title: '专业团队', desc: '熟悉中东文化与商务礼仪的专业团队' },
              { title: '全程服务', desc: '从品牌推广到物流清关，一站式服务' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
                <h3 className="text-xl font-bold mb-4 text-primary-700">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-gold-600 to-gold-500 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            开启您的出海之旅
          </h2>
          <Link to="/contact" className="bg-white text-gold-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition inline-block">
            联系我们
          </Link>
        </div>
      </section>
    </div>
  )
}
