import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Heartbeat } from './heartbeat.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class HeartbeatService {

    private resourceUrl = SERVER_API_URL + 'api/heartbeats';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(heartbeat: Heartbeat): Observable<Heartbeat> {
        const copy = this.convert(heartbeat);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(heartbeat: Heartbeat): Observable<Heartbeat> {
        const copy = this.convert(heartbeat);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Heartbeat> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Heartbeat.
     */
    private convertItemFromServer(json: any): Heartbeat {
        const entity: Heartbeat = Object.assign(new Heartbeat(), json);
        entity.timestamp = this.dateUtils
            .convertDateTimeFromServer(json.timestamp);
        return entity;
    }

    /**
     * Convert a Heartbeat to a JSON which can be sent to the server.
     */
    private convert(heartbeat: Heartbeat): Heartbeat {
        const copy: Heartbeat = Object.assign({}, heartbeat);

        copy.timestamp = this.dateUtils.toDate(heartbeat.timestamp);
        return copy;
    }
}
