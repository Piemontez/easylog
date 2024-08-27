import { Button, Form, Pagination, Table } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { AllLogsCtrl, AllLogsProvider, useAllLogsCtrlStore } from './ctrl';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

const ctrl = new AllLogsCtrl();
const AllLogsPage = () => {
  useEffect(() => {
    ctrl.handleClear();
    ctrl.findIndexes();
  }, []);

  return (
    <AllLogsProvider value={ctrl}>
      <AllLogs />
    </AllLogsProvider>
  );
};

const AllLogs = observer(() => {
  const ctrl = useAllLogsCtrlStore();
  return (
    <>
      <h1>Todos os logs</h1>
      <p>Listagem com todos os registros de logs</p>

      <SearchBar />
      {ctrl.filterLogFormat === 'plain' && <LogsPlainTable />}
      {ctrl.filterLogFormat === 'json' && <LogsJsonTable />}
    </>
  );
});

const SearchBar = observer(() => {
  const ctrl = useAllLogsCtrlStore();
  return (
    <Form>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label htmlFor="indexes">Formato do log:</Form.Label>
              <Form.Select id="indexes" onChange={ctrl.handleLogFormat}>
                <option></option>
                <option value={'plain'}>Plain text</option>
                <option value={'json'}>Json</option>
              </Form.Select>
            </Form.Group>

            <Form.Label htmlFor="filters">Filtros:</Form.Label>
            <Form.Control
              id="filters"
              as="textarea"
              rows={7}
              value={ctrl.filters}
              onChange={ctrl.handleContains}
              isInvalid={!!ctrl.erros?.document}
            />
          </Form.Group>
        </Col>
        <Col xl={3}>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="begin">Início:</Form.Label>
                <Form.Control id="begin" value={ctrl.filterBegin} onChange={ctrl.handleBegin} isInvalid={!!ctrl.erros?.filterBegin} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="end">Fim:</Form.Label>
                <Form.Control id="end" value={ctrl.filterEnd} onChange={ctrl.handleEnd} isInvalid={!!ctrl.erros?.filterBegin} />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="indexes">Índices:</Form.Label>
            <Form.Select id="indexes" onChange={ctrl.handleIndex}>
              <option>Selecione um índice</option>
              {ctrl.indexes.map((index, idx) => (
                <option key={idx} value={index.name}>
                  {index.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="button" className="mb-2 float-end" disabled={!!ctrl.waiting} onClick={ctrl.handleSearch}>
            Buscar
          </Button>

          <Button type="submit" className="mb-2" variant="outline-secondary" disabled={!!ctrl.waiting} onClick={ctrl.handleClear}>
            Limpar
          </Button>
        </Col>
      </Row>
    </Form>
  );
});

const LogsJsonTable = observer(() => {
  const ctrl = useAllLogsCtrlStore();
  return (
    <>
      <Table responsive striped>
        <thead>
          <tr>
            <th>
              Índice
              <br />
              (Index)
            </th>
            <th>
              Data
              <br />
              (Time)
            </th>
            <th>
              Informações
              <br />
              (Data)
            </th>
          </tr>
        </thead>
        <tbody>
          {ctrl?.responseData === null && (
            <tr>
              <td colSpan={3}>Selecione um índice e realize uma busca</td>
            </tr>
          )}
          {ctrl?.responseData?.length === 0 && (
            <tr>
              <td colSpan={3}>Nenhum resultado encontrado</td>
            </tr>
          )}
          {ctrl?.responseData?.map((log, idx) => (
            <tr key={idx}>
              <td>{log.index}</td>
              <td>{log.time}</td>
              <td>{JSON.stringify(log.data)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="mr-2" size="sm" style={{ marginBottom: 0 }}>
        <Pagination.Prev onClick={ctrl!.handlePreviewsPage} disabled={ctrl.page === 1} id="previews_page" />
        <Pagination.Item>{ctrl!.page}</Pagination.Item>
        <Pagination.Next onClick={ctrl!.handleNextPage} id="next_page" />
      </Pagination>
    </>
  );
});

const LogsPlainTable = observer(() => {
  const ctrl = useAllLogsCtrlStore();
  return (
    <>
      <Table responsive striped>
        <thead>
          <tr>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {ctrl?.responseData === null && (
            <tr>
              <td colSpan={3}>Selecione um índice e realize uma busca</td>
            </tr>
          )}
          {ctrl?.responseData?.length === 0 && (
            <tr>
              <td colSpan={3}>Nenhum resultado encontrado</td>
            </tr>
          )}
          {ctrl?.responseData?.map((log, idx) => (
            <tr key={idx}>
              <td>{log}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="mr-2" size="sm" style={{ marginBottom: 0 }}>
        <Pagination.Prev onClick={ctrl!.handlePreviewsPage} disabled={ctrl.page === 1} id="previews_page" />
        <Pagination.Item>{ctrl!.page}</Pagination.Item>
        <Pagination.Next onClick={ctrl!.handleNextPage} id="next_page" />
      </Pagination>
    </>
  );
});

export default AllLogsPage;
