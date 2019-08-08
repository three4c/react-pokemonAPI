export default interface PokemonSearchInterface {
  id: number;
  nameJp: string;
  nameEn: string;
  type01: string;
  type02: string;
  flavorText: string;
  imageNumber: string;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  existence: boolean;
  error: boolean;
  notFound: boolean;
  errorMessage: string;
}
