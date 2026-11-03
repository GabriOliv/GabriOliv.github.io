/** The file's closing module: the end mark (PAGE-09). */
export function EndOfFile() {
  return (
    <footer className="pg-end">
      <div className="pg-eof pg-cap">
        <span className="ds-index" aria-hidden="true" />
        End of file
      </div>
    </footer>
  );
}
