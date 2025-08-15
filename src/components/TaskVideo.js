const TaskVideo = (props) => {
    return(
         <div className="w-[75vw] mt-[-4rem]" style={{ height: "30vh"}}>
          <iframe
            className="w-full h-full rounded-xl shadow-lg"
            src={props.link}
            title="Thematic Task Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              border: "2px solid #fff8de",
              boxShadow: "0 0 20px #fff8de",
            }}
          ></iframe>
        </div>
    );
}

export default TaskVideo;