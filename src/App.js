import { CircularProgress } from "@material-ui/core";
import { useState } from "react";
import "./App.css";
import axios from "./axios";

function App() {
  const [inputFile, setInputFile] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState();
  const [googleVisionApiResult, setGoogleVisionApiResult] = useState();
  const [loading, setLoading] = useState(false);

  const submitbtn = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("image_file", inputFile);
    await axios.post("api/upload", formData).then((response) => {
      setGoogleVisionApiResult(response.data);
      setLoading(false);
    });
  };

  const resetBtn = (e) => {
    e.preventDefault();

    setGoogleVisionApiResult(null);
    setImagePreviewUrl(null);
    document.getElementById("file-input-id").value = "";
  };

  const handleImageChange = (file) => {
    let reader = new FileReader();

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };

    setGoogleVisionApiResult(null);
    file && reader.readAsDataURL(file);
  };

  const RGBToHex = (r, g, b, a) => {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length === 1) r = "0" + r;
    if (g.length === 1) g = "0" + g;
    if (b.length === 1) b = "0" + b;

    return "#" + r + g + b;
  };

  return (
    <div className="App">
      <div className="container-1">
        <form action="">
          <input
            id="file-input-id"
            type="file"
            accept="image/*"
            className="file-input"
            onChange={(e) => {
              setInputFile(e.target.files[0]);
              handleImageChange(e.target.files[0]);
            }}
          />
          {!googleVisionApiResult && (
            <button onClick={submitbtn} disabled={loading}>
              Submit
            </button>
          )}
          {loading && <CircularProgress size="1.5rem" />}
          {googleVisionApiResult && <button onClick={resetBtn}>Reset</button>}
        </form>
      </div>

      <div className="container-2">
        <img
          id="uplaod-image"
          src={imagePreviewUrl}
          alt=""
          className="image-preview"
          style={{ maxWidth: "600px", width: "100%", objectFit: "contain" }}
        />
      </div>

      <div className="container-3">
        {googleVisionApiResult?.logos.length > 0 && (
          <div className="result-logos">
            <h2 className="logo-label">Logos</h2>
            {googleVisionApiResult?.logos.map((element) => {
              return <div>{element.description}</div>;
            })}
          </div>
        )}

        {googleVisionApiResult?.text[0] && (
          <div className="result-text">
            <h2 className="text-label">Text</h2>
            {googleVisionApiResult?.text[0]?.description
              .split("\n")
              .map((element) => {
                return <div>{element}</div>;
              })}
          </div>
        )}

        {googleVisionApiResult?.colors.length > 0 && (
          <div className="result-colors">
            <h2 className="color-label">Color</h2>

            {googleVisionApiResult?.colors.map((element) => {
              let hexString = RGBToHex(
                element.color.red,
                element.color.green,
                element.color.blue
              );
              return (
                <div
                  style={{
                    backgroundColor: hexString,
                    height: "15px",
                    width: "60px",
                  }}
                ></div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
