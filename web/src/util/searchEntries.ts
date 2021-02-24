/**
 * Search and sort a list of entries based on a search term.
 *
 * @param entries The entries to search.
 * @param searchTerm The search term.
 * @param searchValue A function to get the value to search on from an entry.
 */
export function searchEntries<T>(
  entries: T[],
  searchTerm: string,
  searchValue: (e: T) => string
): T[] {
  // Split and sanitize the search term.
  const searchTerms = searchTerm
    .toLowerCase()
    .split(' ')
    .filter((t) => !!t);

  // Filter and sort the entries.
  return entries
    .filter((e) => filterEntry(e, searchTerms, searchValue))
    .sort((a, b) => searchValue(a).localeCompare(searchValue(b)));
}

function filterEntry<T>(
  entry: T,
  searchTerms: string[],
  searchValue: (e: T) => string
): boolean {
  // Check if all search terms match the entry.
  for (let searchI = 0; searchI < searchTerms.length; searchI++) {
    if (!searchValue(entry).toLowerCase().includes(searchTerms[searchI])) {
      return false;
    }
  }
  return true;
}
