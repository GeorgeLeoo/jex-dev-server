@url("/files")
@method("get")
function main({ req, res }) {

  res.send({ code: 0, ok: "success", msg: 'files' });
}

