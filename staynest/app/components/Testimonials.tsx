const testimonials = [
  { quote: "Every detail felt considered, from the local coffee waiting for us to the perfect sunset spot. We left feeling completely restored.", name: "Maya & Daniel", stay: "Stayed at Casa Alba" },
  { quote: "The home was even more beautiful than the photographs. StayNest made the entire experience feel effortless and deeply personal.", name: "Claire R.", stay: "Stayed at Tide House" },
  { quote: "A rare place that worked beautifully for our whole family while still feeling quiet and elevated. We're already planning our return.", name: "The Williams family", stay: "Stayed at Pine & Peak" }
];

export function Testimonials() {
  return <section className="section testimonial-section"><div className="shell"><div className="section-kicker">Guest book</div><h2>Stays worth writing home about.</h2><div className="testimonial-grid">{testimonials.map((item) => <blockquote key={item.name}><div className="stars">★★★★★</div><p>“{item.quote}”</p><footer><strong>{item.name}</strong><span>{item.stay}</span></footer></blockquote>)}</div></div></section>;
}
