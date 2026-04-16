const PokemonCard = ({ name, image, type, stats, description }) => {
  return (
    <div className="pokemon-card">
      <img src={image} alt={name} />

      <h2>{name}</h2>
      <p className="type">{type}</p>

      <p className="description">{description}</p>

      <div className="stats">
        <p>❤️ {stats.hp}</p>
        <p>⚔️ {stats.attack}</p>
        <p>🛡️ {stats.defense}</p>
      </div>
    </div>
  );
};

export default PokemonCard;