import { pascal } from "case";
import { header } from '../utils/header';
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from "@babel/generator";
import { getMessageProperties } from "wasm-ast-types";
import { findAndParseTypes, findExecuteMsg, findQueryMsg, getDefinitionSchema } from '../utils';
import { RenderContext, TsClientOptions } from "wasm-ast-types";
import { BuilderFile } from "../builder";

export default async (
  name: string,
  schemas: any[],
  outPath: string,
  tsClientOptions?: TsClientOptions
): Promise<BuilderFile[]> => {

  const context = new RenderContext(getDefinitionSchema(schemas), {
    tsClient: tsClientOptions ?? {}
  });
  const options = context.options.tsClient;

  const localname = pascal(name) + '.client.ts';
  const TypesFile = pascal(name) + '.types'
  const QueryMsg = findQueryMsg(schemas);
  const ExecuteMsg = findExecuteMsg(schemas);
  const typeHash = await findAndParseTypes(schemas);

  let Client = null;
  let Instance = null;
  let QueryClient = null;
  let ReadOnlyInstance = null;

  const body = [];

  body.push(
    w.importStmt(Object.keys(typeHash), `./${TypesFile}`)
  );

  // query messages
  if (QueryMsg) {

    QueryClient = pascal(`${name}QueryClient`);
    ReadOnlyInstance = pascal(`${name}ReadOnlyInterface`);

    body.push(
      w.createQueryInterface(context, ReadOnlyInstance, QueryMsg)
    );
    body.push(
      w.createQueryClass(context, QueryClient, ReadOnlyInstance, QueryMsg)
    );
  }

  // execute messages
  if (ExecuteMsg) {
    const children = getMessageProperties(ExecuteMsg);
    if (children.length > 0) {
      Client = pascal(`${name}Client`);
      Instance = pascal(`${name}Interface`);

      body.push(
        w.createExecuteInterface(
          context,
          Instance,
          ReadOnlyInstance,
          ExecuteMsg
        )
      );
      body.push(
        w.createExecuteClass(
          context,
          Client,
          Instance,
          QueryClient,
          ExecuteMsg
        )
      );
    }
  }

  if (typeHash.hasOwnProperty('Coin')) {
    delete context.utils.Coin;
  }
  const imports = context.getImports();
  const code = header + generate(
    t.program([
      ...imports,
      ...body
    ])
  ).code;

  mkdirp(outPath);
  writeFileSync(join(outPath, localname), code);

  return [
    {
      type: 'client',
      contract: name,
      localname,
      filename: join(outPath, localname),
    }
  ]
};