export const GloablFilter = ({ filter, setFilter, text }) => {
  return (
    <input
      type="text"
      placeholder={text}
      name="filter"
      id="filter"
      className=" w-full p-2 px-10 text-center text-slate-700 font-semibold rounded-md rounded-t-md focus:outline-blue-400"
      value={filter || ""}
      onChange={(e) => setFilter(e.target.value)}
    />
  );
};
