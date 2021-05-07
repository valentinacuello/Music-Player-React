import React, { useState, useRef, useEffect } from "react";
import Style from "../../styles/index.scss";
import {
	SkipForwardFill,
	PlayCircleFill,
	PauseCircleFill,
	SkipBackwardFill,
	Shuffle,
	ArrowRepeat
} from "react-bootstrap-icons";

const Reproductor = () => {
	const [isPlaying, setPlaying] = useState(false);
	const [songList, setSongList] = useState([]);
	const [songActual, setSongActual] = useState();

	const obtenerSongList = async () => {
		try {
			const res = await fetch(
				"https://assets.breatheco.de/apis/sound/songs"
			);
			const data = await res.json();
			setSongList(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		obtenerSongList();
	}, []);

	let audio = useRef();

	const reproducir = () => {
		if (audio.current.paused) {
			audio.current.play();
			setPlaying(true);
		} else if (!audio.current.paused) {
			audio.current.pause();
			setPlaying(false);
		}
	};

	const cambiarSrcAudio = (url, songIndex) => {
		let stringfijo = "https://assets.breatheco.de/apis/sound/";
		audio.current.src = stringfijo + url;
		setSongActual(songIndex);
		setPlaying(true);
	};

	const nextSong = () => {
		let songIndex = songActual + 1;
		if (songIndex > songList.length - 1) {
			songIndex = 0;
		}
		cambiarSrcAudio(songList[songIndex].url, songIndex);
		audio.current.play();
	};

	const previousSong = () => {
		let previousSong = songActual - 1;
		cambiarSrcAudio(songList[previousSong].url, previousSong);
		audio.current.play();
	};

	return (
		<div>
			<div className="rp-container">
				<div className="rp-item-container">
					{songList.map((objeto, index) => {
						return (
							<div
								className={
									"rp-item " +
									(songActual == index ? "active" : "")
								}
								key={index}
								onClick={() => {
									cambiarSrcAudio(objeto.url, index);
									reproducir();
								}}>
								<p>
									<span>{objeto.id}</span> {objeto.name}
								</p>
							</div>
						);
					})}
					<audio
						ref={audio}
						src="https://assets.breatheco.de/apis/sound/files/mario/songs/castle.mp3"></audio>
				</div>
				<div className="rp-btn-container">
					<div className="rp-btn">
						<button>
							<Shuffle size={15} />
						</button>
						<button id="forward" onClick={previousSong}>
							<SkipBackwardFill size={20} />
						</button>
						<button id="play" onClick={reproducir}>
							{isPlaying ? (
								<PauseCircleFill size={40} />
							) : (
								<PlayCircleFill size={40} />
							)}
						</button>
						<button id="backward" onClick={nextSong}>
							<SkipForwardFill size={20} />
						</button>
						<button>
							<ArrowRepeat size={15} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

//rp: reproductor

export default Reproductor;
