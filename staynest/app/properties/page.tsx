import { PropertyCard } from "../components/PropertyCard";
import { properties } from "../data/properties";

export default function PropertiesPage() {
  return (
    <>
      <section className="page-hero"><div className="shell"><div className="section-kicker">The collection</div><h1>Find your way<br /><em>somewhere special.</em></h1><p>Four singular homes, each chosen for the way they make you feel.</p></div></section>
      <section className="section properties-page" id="stay"><div className="shell"><div className="filter-bar"><span><b>{properties.length}</b> remarkable homes</span><div><button className="active">All stays</button><button>Coast</button><button>Mountains</button><button>Desert</button><button>Wine country</button></div></div><div className="property-grid property-grid-two">{properties.map((property) => <PropertyCard property={property} key={property.slug} />)}</div></div></section>
    </>
  );
}
