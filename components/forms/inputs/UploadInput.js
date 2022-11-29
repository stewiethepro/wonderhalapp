
export default function UploadInput() {

  const handleUpload = async (e) => {
    let file;

    if (e.target.files) {
      file = e.target.files[0];
    }

    console.log(file);

    // const { data, error } = await supabase.storage
    //   .from("images")
    //   .upload("public/" + file?.name, file);

    // if (data) {
    //   console.log(data);
    // } else if (error) {
    //   console.log(error);
    // }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">


      <input
        type="file"
        accept="image/*"
        className="block w-auto text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        onChange={(e) => {
          handleUpload(e); // 👈 this will trigger when user selects the file.
        }}
      />
    </div>
  );
};
