import React, { Component } from "react";
import PokemonSearchInterface from "../interfaces/PokemonSearch.interface";
import PokemonResult from "./PokemonResult";
import ErorrMessage from "./ErrorMessage";
import Pokedex from "../json/pokedex.json";
import Types from "../json/types.json";
import "../scss/PokemonSearch.scss";

export default class PokemonSearch extends Component<{}, PokemonSearchInterface> {
  pokemonRef: React.RefObject<HTMLInputElement>;
  constructor(props: {}) {
    super(props);
    this.state = {
      id: null,
      nameJp: "",
      nameEn: "",
      attack: null,
      defense: null,
      hp: null,
      spAttack: null,
      spDefense: null,
      speed: null,
      type01: "",
      type02: "",
      flavorText: "",
      imageNumber: "",
      existence: false,
      error: false,
      notFound: false,
      errorMessage: "ポケモンを みつけることが できませんでした。"
    };

    this.pokemonRef = React.createRef();
  }

  private onPokemonSearchButton = (): void => {
    const inputValue: string = this.pokemonRef.current.value;
    let checkPokemonCounter: number = 0;

    for (let i in Pokedex) {
      if (Pokedex[i].name.japanese === inputValue) {
        const imageNumber: string = ("000" + Pokedex[i].id).slice(-3);

        this.setState({
          type02: ""
        });

        for (let j in Types) {
          if (Types[j].english === Pokedex[i].type[0]) {
            this.setState({
              type01: Types[j].japanese
            });
          }

          if (Types[j].english === Pokedex[i].type[1]) {
            this.setState({
              type02: Types[j].japanese
            });
          }
        }

        fetch(`https://pokeapi.co/api/v2/pokemon-species/${Pokedex[i].id}`).then(res => {
          if (res.status !== 200) {
            this.setState({
              error: true,
              flavorText:
                Pokedex[i].name.japanese + "の せつめいは ありません。"
            });
            return;
          }
          res.json().then(data => {
            let flavorText: string = "";
            for (let k in data.flavor_text_entries) {
              if (data.flavor_text_entries[k].language.name === "ja-Hrkt") {
                flavorText = data.flavor_text_entries[k].flavor_text;
              }
            }
            this.setState({
              error: false,
              flavorText: flavorText
            });
          });
        });

        this.setState({
          id: Pokedex[i].id,
          nameJp: Pokedex[i].name.japanese,
          nameEn: Pokedex[i].name.english,
          attack: Pokedex[i].base.Attack,
          defense: Pokedex[i].base.Defense,
          hp: Pokedex[i].base.HP,
          spAttack: Pokedex[i].base["Sp. Attack"],
          spDefense: Pokedex[i].base["Sp. Defense"],
          speed: Pokedex[i].base.Speed,
          imageNumber: imageNumber,
          existence: true,
          notFound: false
        });
      } else {
        checkPokemonCounter++;
      }
    }
    if (checkPokemonCounter === Pokedex.length) {
      this.setState({
        notFound: true,
        existence: false
      });
    }
  };

  private onEnterKey = (e: any): void => {
    if (e.keyCode === 13) {
      this.onPokemonSearchButton();
    }
  }

  render() {
    return (
      <div className={"PokemonSearch-wrapper" + (this.state.existence ? "" : " PokemonSearch-wrapper--center")}>
        <div className="PokemonSearch">
          <h1 className="PokemonSearch__title">POKEMON SEARCH</h1>
          <div className="PokemonSearch__area">
            <input
              className="PokemonSearch__input"
              type="text"
              ref={this.pokemonRef}
              onKeyDown={this.onEnterKey}
              placeholder="けんさくしたい ポケモンを にゅうりょくしよう"
            />
            <button
              className="PokemonSearch__button"
              onClick={this.onPokemonSearchButton}
            >
              けんさく
            </button>
          </div>
          <ErorrMessage
            notFound={this.state.notFound}
            errorMessage={this.state.errorMessage}
          />
          {this.state.existence && (
            <PokemonResult
              nameJp={this.state.nameJp}
              nameEn={this.state.nameEn}
              imageNumber={this.state.imageNumber}
              flavorText={this.state.flavorText}
              id={this.state.id}
              type01={this.state.type01}
              type02={this.state.type02}
              hp={this.state.hp}
              attack={this.state.attack}
              defense={this.state.defense}
              spAttack={this.state.spAttack}
              spDefense={this.state.spDefense}
              speed={this.state.speed}
            />
          )}
        </div>
      </div>
    );
  }
}
