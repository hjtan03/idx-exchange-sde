import { render, screen, fireEvent } from '@testing-library/react';
import Pagination, { getPageNumbers } from './Pagination';

describe('getPageNumbers', () => {
  test('returns all pages when total pages fit without ellipsis', () => {
    expect(getPageNumbers(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('shows ellipsis at the end when current page is near the start', () => {
    expect(getPageNumbers(2, 20)).toEqual([1, 2, 3, 4, 5, '...', 20]);
  });

  test('shows ellipsis at the start when current page is near the end', () => {
    expect(getPageNumbers(19, 20)).toEqual([1, '...', 16, 17, 18, 19, 20]);
  });

  test('shows ellipsis on both sides when current page is in the middle', () => {
    expect(getPageNumbers(10, 20)).toEqual([1, '...', 9, 10, 11, '...', 20]);
  });

  test('does not duplicate the last page number near the end (debug challenge)', () => {
    const result = getPageNumbers(23, 24);
    const lastPageCount = result.filter(p => p === 24).length;
    expect(lastPageCount).toBe(1);
  });
});

describe('Pagination component', () => {
  test('renders nothing when there is only one page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalItems={10} itemsPerPage={20} onPageChange={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('Previous button is disabled on page 1', () => {
    render(<Pagination currentPage={1} totalItems={200} itemsPerPage={20} onPageChange={jest.fn()} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  test('Next button is disabled on the last page', () => {
    render(<Pagination currentPage={10} totalItems={200} itemsPerPage={20} onPageChange={jest.fn()} />);
    expect(screen.getByText('Next')).toBeDisabled();
  });

  test('clicking a page number calls onPageChange with that page', () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={1} totalItems={200} itemsPerPage={20} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('clicking Next calls onPageChange with currentPage + 1', () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={2} totalItems={200} itemsPerPage={20} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('never produces a duplicate page number across a wide range of inputs (debug challenge, exhaustive)', () => {
    for (let totalPages = 1; totalPages <= 50; totalPages++) {
        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const result = getPageNumbers(currentPage, totalPages);
            const numericPages = result.filter(p => p !== '...');
            const uniquePages = new Set(numericPages);
            expect(uniquePages.size).toBe(numericPages.length);
            }
        }
   });

  test('never produces a duplicate at real-world scale (100, 1000, 2656 total pages)', () => {
    const totalsToTest = [100, 1000, 2656];

    totalsToTest.forEach(totalPages => {
        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const result = getPageNumbers(currentPage, totalPages);
            const numericPages = result.filter(p => p !== '...');
            const uniquePages = new Set(numericPages);

            if (uniquePages.size !== numericPages.length) {
                throw new Error(
                    `Duplicate found at currentPage=${currentPage}, totalPages=${totalPages}: ${JSON.stringify(result)}`
                );
            }
        }
    });
  });
});